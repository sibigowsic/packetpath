from security import validate_domain_input, validate_resolved_ip
import socket

def run_security_test_suite():
    print("=== PACKETPATH PHASE 2 SECURITY AUDIT TEST SUITE ===")
    
    test_cases = [
        ("google.com", "EXPECT_PASS"),
        ("invalid domain", "EXPECT_FAIL"),
        ("localhost", "EXPECT_FAIL"),
        ("127.0.0.1", "EXPECT_FAIL"),
        ("192.168.1.1", "EXPECT_FAIL"),
        ("google.com & whoami", "EXPECT_FAIL"),
        ("google.com; cat /etc/passwd", "EXPECT_FAIL"),
        ("http://google.com:8080/path", "EXPECT_PASS_SANITIZED"),
        ("169.254.1.1", "EXPECT_FAIL"),
        ("224.0.0.1", "EXPECT_FAIL"),
    ]

    passed_count = 0
    total_count = len(test_cases)

    for target, expectation in test_cases:
        print(f"\n[TESTING] Input: '{target}' | Expected: {expectation}")
        try:
            clean_domain = validate_domain_input(target)
            print(f"  -> Sanitized Domain: '{clean_domain}'")
            
            # Resolve IP
            dest_ip = socket.gethostbyname(clean_domain)
            print(f"  -> Resolved IP: '{dest_ip}'")
            
            # Validate IP
            is_valid_ip, reason = validate_resolved_ip(dest_ip)
            if not is_valid_ip:
                raise Exception(f"Forbidden IP target: {reason}")

            print(f"  -> Result: ACCEPTED for public trace ({dest_ip})")
            if "FAIL" in expectation:
                print("  [X] UNEXPECTED PASS (Security vulnerability!)")
            else:
                print("  [OK] TEST PASSED")
                passed_count += 1

        except Exception as e:
            print(f"  -> Result: REJECTED ({e})")
            if "FAIL" in expectation:
                print("  [OK] TEST PASSED (Successfully blocked)")
                passed_count += 1
            else:
                print(f"  [X] UNEXPECTED FAIL: {e}")

    print(f"\n=== SUMMARY: {passed_count}/{total_count} Security Tests Passed ===")

if __name__ == "__main__":
    run_security_test_suite()
