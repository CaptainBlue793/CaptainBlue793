"""Optimize README GIFs with Gifsicle and check every decoded animation state.

Run with the existing starGPU environment and --gifsicle /path/to/gifsicle.
Outputs are written to a temporary directory; source assets are left intact.
"""

import argparse
import json
import re
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image


def timing(path):
    with Image.open(path) as image:
        durations = []
        for index in range(image.n_frames):
            image.seek(index)
            durations.append(image.info.get("duration", 0))
        return image.size, image.info.get("loop"), durations


def same_visible_pixels(left, right):
    a, b = np.asarray(left), np.asarray(right)
    if not np.array_equal(a[:, :, 3], b[:, :, 3]):
        return False
    visible = a[:, :, 3] != 0
    return np.array_equal(a[:, :, :3][visible], b[:, :, :3][visible])


def verify_animation(reference, optimized):
    """Allow merged identical frames, while verifying pixels at every change."""
    with Image.open(reference) as left, Image.open(optimized) as right:
        if left.size != right.size or left.info.get("loop") != right.info.get("loop"):
            raise ValueError("Animation dimensions or looping changed")
        left_index = right_index = 0
        left_frame, right_frame = left.convert("RGBA"), right.convert("RGBA")
        left_remaining = left.info.get("duration", 0)
        right_remaining = right.info.get("duration", 0)
        while True:
            if not same_visible_pixels(left_frame, right_frame):
                raise ValueError(f"Animation pixels differ at frames {left_index}/{right_index}")
            elapsed = min(left_remaining, right_remaining)
            if elapsed <= 0:
                raise ValueError("Animation has a zero-duration frame")
            left_remaining -= elapsed
            right_remaining -= elapsed
            if left_remaining == 0:
                left_index += 1
                if left_index < left.n_frames:
                    left.seek(left_index)
                    left_frame = left.convert("RGBA")
                    left_remaining = left.info.get("duration", 0)
            if right_remaining == 0:
                right_index += 1
                if right_index < right.n_frames:
                    right.seek(right_index)
                    right_frame = right.convert("RGBA")
                    right_remaining = right.info.get("duration", 0)
            left_finished = left_index == left.n_frames
            right_finished = right_index == right.n_frames
            if left_finished or right_finished:
                if left_finished != right_finished:
                    raise ValueError("Animation timelines differ")
                break


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--gifsicle", required=True)
    parser.add_argument("--width", type=int, default=320)
    parser.add_argument("--output-dir", type=Path)
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    readme = re.sub(r"<!--[\s\S]*?-->", "", (root / "README.md").read_text(encoding="utf-8"))
    asset_pattern = r'src="(?:https://raw\.githubusercontent\.com/CaptainBlue793/CaptainBlue793/[0-9a-f]{40}/)?((?:Alphabets|Icons)/[^"?]+\.gif)"'
    assets = sorted(set(re.findall(asset_pattern, readme)))
    if not assets:
        raise ValueError("No local README GIF assets found")
    output = args.output_dir or Path(tempfile.mkdtemp(prefix="captainblue-optimized-gifs-"))
    report = []
    for asset in assets:
        source, target = root / asset, output / asset
        reference = output / "validation" / asset
        target.parent.mkdir(parents=True, exist_ok=True)
        reference.parent.mkdir(parents=True, exist_ok=True)
        common = [args.gifsicle, "--resize-width", str(args.width),
                  "--resize-method", "lanczos3", "--no-comments", "--no-extensions"]
        subprocess.run(common + ["--unoptimize", str(source), "--output", str(reference)], check=True)
        subprocess.run([args.gifsicle, "--optimize=3", "--no-comments", "--no-extensions",
                        str(reference), "--output", str(target)], check=True)
        original_size, original_loop, original_durations = timing(source)
        target_size, target_loop, target_durations = timing(target)
        if (original_size[0] * target_size[1] != original_size[1] * target_size[0]
                or original_loop != target_loop
                or sum(original_durations) != sum(target_durations)):
            raise ValueError(f"Aspect ratio, looping or total duration changed: {asset}")
        verify_animation(reference, target)
        before, after = source.stat().st_size, target.stat().st_size
        if after >= before:
            raise ValueError(f"Optimized GIF is not smaller: {asset}")
        report.append({"file": asset, "before_bytes": before, "after_bytes": after,
                       "original_dimensions": original_size, "dimensions": target_size,
                       "original_frames": len(original_durations), "frames": len(target_durations),
                       "duration_ms": sum(target_durations), "loop": target_loop})
        print(f"{asset}: {before:,} -> {after:,} bytes; animation verified", flush=True)
    before = sum(item["before_bytes"] for item in report)
    after = sum(item["after_bytes"] for item in report)
    (output / "report.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"TOTAL: {before:,} -> {after:,} bytes ({100 * (1 - after / before):.1f}% smaller)")
    print(f"Output: {output}")


if __name__ == "__main__":
    main()
