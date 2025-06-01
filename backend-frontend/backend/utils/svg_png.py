import segno
import cairosvg
import os


# from project.settings import MEDIA_ROOT


def generate_qr_with_svg_overlay(text):
    """
    Generate a QR code with an SVG overlay on top and convert it to PNG.

    Args:
        text (str): The text or data for the QR code.
        overlay_svg_path (str): Path to the SVG file to overlay.
        output_svg_path (str): Path to save the resulting SVG.
        output_png_path (str): Path to save the resulting PNG.
    """
    # Generate the QR code as SVG
    qr = segno.make(text)
    qr_svg_path = "temp_qr.svg"
    qr.save(qr_svg_path, scale=20)  # Save as an SVG with a larger scale

    # Load the QR code SVG and clean it
    with open(qr_svg_path, 'r') as qr_file:
        qr_svg_content = qr_file.read().strip()
        # Remove XML declaration if present
        if qr_svg_content.startswith('<?xml'):
            qr_svg_content = qr_svg_content.split('?>', 1)[1].strip()

    # Load the overlay SVG and clean it
    with open('utils/uGem.svg', 'r') as overlay_file:
        overlay_content = overlay_file.read().strip()
        # Remove XML declaration if present
        if overlay_content.startswith('<?xml'):
            overlay_content = overlay_content.split('?>', 1)[1].strip()

    # Combine the SVGs
    svg_template = f"""<?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" width="1040" height="1240" viewBox="0 0 1040 1240">
        <!-- Add a rounded border -->
        <g transform="translate(19, 19)">  <!-- Adjust positioning and scale -->
        <rect x="1.5" y="1.5" width="1000" height="1200" rx="30" ry="30" fill="none" stroke="black" stroke-width="40"/>
        </g>

        <!-- QR Code -->
        <g transform="translate(28, 28)">  <!-- Adjust positioning and scale -->
            {qr_svg_content}
        </g>

        <!-- Overlay positioned at the center -->
        <g transform="translate(260, 980) scale(2.2)">  <!-- Adjust positioning and scale -->
            {overlay_content}
        </g>
    </svg>
    """

    # Clean up temporary QR SVG file
    if os.path.exists(qr_svg_path):
        os.remove(qr_svg_path)

    try:
        png_output = cairosvg.svg2png(bytestring=svg_template.encode('utf-8'))
        print("PNG version generated successfully.")
        return png_output  # Return PNG data as bytes
    except Exception as e:
        print(f"Error converting SVG to PNG: {e}")
        return None

    # # Save the final SVG
    # with open(output_svg_path, 'w') as output_file:
    #     output_file.write(svg_template.strip())
    #
    # print(f"QR code with overlay saved to {output_svg_path}")
    #
    # # Convert SVG to PNG using CairoSVG
    # try:
    #     cairosvg.svg2png(url=output_svg_path, write_to=output_png_path)
    #     print(f"PNG version saved to {output_png_path}")
    # except Exception as e:
    #     print(f"Error converting SVG to PNG: {e}")

# Usage
# generate_qr_with_svg_overlay(
#     text="https://example.com",
#     overlay_svg_path=f"{MEDIA_ROOT}/uGem.svg",  # Path to your SVG logo
#     output_svg_path=f"{MEDIA_ROOT}/qr_with_logo.svg",  # Path for the final SVG
#     output_png_path=f"{MEDIA_ROOT}/qr_with_logo.png"  # Path for the final PNG
# )
