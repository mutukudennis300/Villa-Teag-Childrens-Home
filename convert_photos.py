"""Convert new source photos in images_backup to WebP files in images."""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps, UnidentifiedImageError
except ImportError:
    print(
        "Pillow is required. Install it with: "
        "py -3 -m pip install -r requirements-convert.txt",
        file=sys.stderr,
    )
    raise SystemExit(1)


ROOT = Path(__file__).resolve().parent
SOURCE_DIR = ROOT / "images_backup"
OUTPUT_DIR = ROOT / "images"
PHOTO_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff"}
MAX_IMAGE_SIDE = 1800
WEBP_QUALITY = 75
PHOTO_ALT_TEXT = {
    "FB_IMG_1792007662883.webp": "Children and adults taking part in a group activity indoors.",
    "FB_IMG_1792007793984.webp": "Promotional graphic showing a group outside Villa Teag Children's Home.",
    "FB_IMG_1792007832356.webp": "A man holding a young child indoors.",
    "FB_IMG_1792007835471.webp": "A man holding a young child.",
    "FB_IMG_1792007945786.webp": "Children and adults gathered at an indoor event.",
    "FB_IMG_1792008015072.webp": "Two adults holding a certificate at an event.",
    "FB_IMG_1792008028516.webp": "Three adults sitting around a laptop.",
    "FB_IMG_1792008033411.webp": "A man and woman talking beside a laptop.",
    "FB_IMG_1792008037334.webp": "Children and adults gathered at an indoor event.",
    "FB_IMG_1792008347272.webp": "A large group gathered outside Villa Teag Children's Home.",
    "FB_IMG_1792008354069.webp": "Children playing together in an outdoor pool.",
    "FB_IMG_1792008360548.webp": "Promotional collage featuring children in water activities.",
    "FB_IMG_1792008363737.webp": "An adult lifting a child outdoors.",
    "FB_IMG_1792008373657.webp": "Two women smiling together at an indoor gathering.",
    "FB_IMG_1792008379502.webp": "Children and adults posing together outside the home.",
    "FB_IMG_1792008389475.webp": "Children and adults standing outside a school building.",
    "FB_IMG_1792008455486.webp": "Promotional graphic featuring children and Villa Teag branding.",
    "FB_IMG_1792008458711.webp": "Promotional graphic featuring an adult and children.",
    "FB_IMG_1792008461314.webp": "Promotional graphic featuring an adult and children.",
    "FB_IMG_1792008464060.webp": "Promotional graphic featuring an adult and children.",
    "FB_IMG_1792008467036.webp": "Promotional graphic featuring an adult and children.",
    "FB_IMG_1792008470401.webp": "Promotional graphic featuring children and adults.",
    "FB_IMG_1792008473407.webp": "Promotional graphic showing an adult holding a child.",
    "FB_IMG_1792008476384.webp": "Promotional graphic featuring children and adults.",
    "FB_IMG_1792008479631.webp": "Promotional graphic showing a man with two children.",
    "FB_IMG_1792008482907.webp": "Promotional graphic featuring a group of children and adults.",
    "FB_IMG_1792008486017.webp": "Promotional graphic featuring children and adults.",
    "FB_IMG_1792008489469.webp": "Promotional graphic showing an adult with a child.",
    "FB_IMG_1792008567708.webp": "Children and adults gathered around a table indoors.",
    "FB_IMG_1792008570345.webp": "A woman posing outdoors.",
    "FB_IMG_1792008573205.webp": "A woman holding a baby outdoors.",
    "images (1).webp": "Children and adults seated around tables during an indoor activity.",
    "images (2).webp": "Villa Teag Children's Home sign and group outside the entrance.",
    "images (3).webp": "A woman standing in a doorway.",
    "images (4).webp": "Children and adults posing together outside a building.",
    "images (5).webp": "Children seated together inside a room.",
    "images (6).webp": "Children and adults seated together during an indoor activity.",
    "images (7).webp": "Children and adults holding papers at an event.",
    "images (8).webp": "A bed in an indoor bedroom.",
    "images.webp": "Villa Teag Children's Home entrance and sign.",
}
GENERIC_ALT_TEXT = "Photograph from Villa Teag Children's Home."


def file_hash(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def is_valid_webp(path: Path) -> bool:
    try:
        with Image.open(path) as image:
            return image.format == "WEBP" and image.width > 0 and image.height > 0
    except (OSError, UnidentifiedImageError):
        return False


def read_previous_alt_text(manifest_path: Path) -> dict[str, str] | None:
    if not manifest_path.exists():
        return {}
    try:
        previous = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        print(f"ERROR: could not read gallery manifest: {error}", file=sys.stderr)
        return None
    if not isinstance(previous, list):
        print("ERROR: gallery manifest must contain a list.", file=sys.stderr)
        return None

    descriptions: dict[str, str] = {}
    for item in previous:
        if (
            isinstance(item, dict)
            and isinstance(item.get("name"), str)
            and isinstance(item.get("alt"), str)
        ):
            descriptions[item["name"]] = item["alt"]
    return descriptions


def convert_new_photos() -> int:
    if not SOURCE_DIR.is_dir():
        print(f"Source folder not found: {SOURCE_DIR}", file=sys.stderr)
        return 1

    OUTPUT_DIR.mkdir(exist_ok=True)
    manifest_path = ROOT / "gallery-images.json"
    previous_alt_text = read_previous_alt_text(manifest_path)
    if previous_alt_text is None:
        return 1

    sources = sorted(
        path
        for path in SOURCE_DIR.iterdir()
        if path.is_file() and path.suffix.lower() in PHOTO_EXTENSIONS
    )
    if not sources:
        print(f"No supported photos found in {SOURCE_DIR}")
        return 0

    stem_sources: dict[str, Path] = {}
    collisions: set[str] = set()
    for source in sources:
        key = source.stem.casefold()
        if key in stem_sources:
            collisions.add(key)
        else:
            stem_sources[key] = source

    errors = 0
    converted = 0
    skipped = 0
    source_by_hash: dict[str, Path] = {}
    for source in sources:
        source_by_hash.setdefault(file_hash(source), source)
        if source.stem.casefold() in collisions:
            print(f"ERROR: duplicate photo name would overwrite another file: {source.name}")
            errors += 1
            continue

        destination = OUTPUT_DIR / f"{source.stem}.webp"
        if destination.exists():
            if is_valid_webp(destination):
                print(f"SKIP: {destination.name} already exists")
                skipped += 1
            else:
                print(f"ERROR: existing output is not a valid WebP: {destination.name}")
                errors += 1
            continue

        temporary = destination.with_name(f".{destination.name}.tmp.webp")
        try:
            with Image.open(source) as original:
                image = ImageOps.exif_transpose(original)
                image.thumbnail(
                    (MAX_IMAGE_SIDE, MAX_IMAGE_SIDE),
                    Image.Resampling.LANCZOS,
                )
                image.save(
                    temporary,
                    format="WEBP",
                    quality=WEBP_QUALITY,
                    method=6,
                )
            if not is_valid_webp(temporary):
                raise OSError("converted output failed WebP validation")
            temporary.replace(destination)
            print(f"CONVERTED: {source.name} -> {destination.name}")
            converted += 1
        except (OSError, UnidentifiedImageError) as error:
            temporary.unlink(missing_ok=True)
            print(f"ERROR: could not convert {source.name}: {error}", file=sys.stderr)
            errors += 1

    if errors:
        print(f"Finished with {errors} error(s); source photos were kept.")
        return 1

    removed_legacy = 0
    for old_file in OUTPUT_DIR.iterdir():
        if not old_file.is_file() or old_file.suffix.lower() not in PHOTO_EXTENSIONS:
            continue
        matching_source = source_by_hash.get(file_hash(old_file))
        if not matching_source:
            print(f"NOTICE: kept unmatched non-WebP file: {old_file.name}")
            continue
        if (OUTPUT_DIR / f"{matching_source.stem}.webp").is_file():
            old_file.unlink()
            removed_legacy += 1
            print(f"REMOVED legacy copy: {old_file.name}")

    manifest = []
    for path in sorted(OUTPUT_DIR.glob("*.webp"), key=lambda item: item.name.casefold()):
        previous_alt = previous_alt_text.get(path.name)
        if previous_alt and previous_alt != GENERIC_ALT_TEXT:
            alt_text = previous_alt
        else:
            alt_text = PHOTO_ALT_TEXT.get(path.name)
        if not alt_text and sys.stdin.isatty():
            alt_text = input(f"Describe {path.name} for screen readers: ").strip()
        if not alt_text:
            alt_text = GENERIC_ALT_TEXT
            print(f"NOTICE: add a specific alt description for {path.name}")
        manifest.append({"name": path.name, "alt": alt_text})

    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(
        f"Done: {converted} converted, {skipped} already present, "
        f"{removed_legacy} legacy copies removed."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(convert_new_photos())
