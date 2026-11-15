import sys
import speedtest


def convert_to_mbps(speed_bits):
    """Converts speed from bits per second to megabits per second (Mbps)."""
    return round(speed_bits / 1_000_000, 2)


def perform_speed_test():
    """
    Performs a download and upload speed test and prints the results.
    """
    try:
        print("Starting speed test...")

        # Create a Speedtest object and force secure connections
        st = speedtest.Speedtest(secure=True)

        # Get the best server based on ping
        print("Finding the best server...")
        st.get_best_server()

        print("Performing download test...")
        download_speed_bits = st.download()

        print("Performing upload test...")
        upload_speed_bits = st.upload()

        # Get ping result
        ping_result = round(st.results.ping, 2)

        # Convert speeds to Mbps
        download_speed_mbps = convert_to_mbps(download_speed_bits)
        upload_speed_mbps = convert_to_mbps(upload_speed_bits)

        # Print the results
        print("\n--- Speed Test Results ---")
        print(f"Ping: {ping_result} ms")
        print(f"Download Speed: {download_speed_mbps} Mbps")
        print(f"Upload Speed: {upload_speed_mbps} Mbps")

        return {
            "download_mbps": download_speed_mbps,
            "upload_mbps": upload_speed_mbps,
            "ping_ms": ping_result
        }

    except speedtest.SpeedtestException as e:
        print(f"An error occurred during the speed test: {e}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}", file=sys.stderr)
        return None


if __name__ == "__main__":
    test_results = perform_speed_test()
    print(test_results)
    if test_results:
        # Example of how to use the returned dictionary
        print("\n--- Programmatic Access to Results ---")
        print(f"Download: {test_results['download_mbps']} Mbps")
        print(f"Upload: {test_results['upload_mbps']} Mbps")
