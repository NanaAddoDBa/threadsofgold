import { check, sleep } from "k6";
import http from "k6/http";

const authorization = __ENV.TOG_ALLOW_PERFORMANCE_TEST;
const configuredTarget = __ENV.TOG_PERFORMANCE_TARGET;
const approvedExternalOrigin = __ENV.TOG_PERFORMANCE_ALLOWED_ORIGIN;

if (authorization !== "1") {
  throw new Error(
    "Performance smoke test is disabled. Set TOG_ALLOW_PERFORMANCE_TEST=1 after confirming the target and authorization.",
  );
}

if (!configuredTarget) {
  throw new Error(
    "TOG_PERFORMANCE_TARGET is required and must be an explicit HTTP(S) origin without a path.",
  );
}

const target = configuredTarget.replace(/\/$/u, "");
const validOrigin = /^https?:\/\/[a-zA-Z0-9.-]+(?::\d{1,5})?$/u;

if (!validOrigin.test(target)) {
  throw new Error(
    "TOG_PERFORMANCE_TARGET must be an HTTP(S) origin without credentials, a path, query parameters, or a fragment.",
  );
}

const loopbackTarget = /^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d{1,5})?$/u;
const normalizedApprovedExternalOrigin = approvedExternalOrigin?.replace(
  /\/$/u,
  "",
);

if (
  !loopbackTarget.test(target) &&
  normalizedApprovedExternalOrigin !== target
) {
  throw new Error(
    "A non-loopback target requires TOG_PERFORMANCE_ALLOWED_ORIGIN to exactly match TOG_PERFORMANCE_TARGET.",
  );
}

export const options = {
  // These low-volume thresholds validate the harness. They are not approved
  // production SLOs, a capacity result, or evidence for launch sizing.
  scenarios: {
    storefront_smoke: {
      duration: "20s",
      executor: "constant-vus",
      gracefulStop: "5s",
      vus: 1,
    },
  },
  thresholds: {
    checks: ["rate>0.99"],
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function storefrontSmoke() {
  const response = http.get(`${target}/shop`, {
    redirects: 0,
    tags: { journey: "storefront-discovery" },
  });

  check(response, {
    "collection responds with HTTP 200": (result) => result.status === 200,
    "collection identifies Threads of Gold": (result) =>
      result.body?.includes("Threads of Gold") === true,
  });

  sleep(1);
}
