import urllib.request
import os

pdf_url = "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGZc2S2Wun_9Mh0A0pkJbL1BiMHczppgEb_89XRXDbyVIfcpa32704rae4jEAxbhfwspRq0uMrWcl88nhhhjYYBkOWvXEEzuf475sRaWRUaue-lidg_dmCb94j4RA5v55Tskhj1UGRrMabJCqfG6iWap80QvsQ8ycBqOZKunHEjGaI1-sHDBk0019hyj7OEXP4="
out_dir = "references"
out_file = os.path.join(out_dir, "KR_RDA_strawberry_smartfarm-manual_2022.pdf")

os.makedirs(out_dir, exist_ok=True)

print(f"Downloading PDF from redirect link to {out_file}...")

req = urllib.request.Request(
    pdf_url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
)

try:
    with urllib.request.urlopen(req) as response:
        # Check if we were redirected to a PDF or an HTML page
        content_type = response.info().get_content_type()
        print(f"Content-Type: {content_type}")
        print(f"Redirected URL: {response.geturl()}")
        
        with open(out_file, 'wb') as f:
            f.write(response.read())
    print("Download completed successfully!")
except Exception as e:
    print(f"Error downloading PDF: {e}")
