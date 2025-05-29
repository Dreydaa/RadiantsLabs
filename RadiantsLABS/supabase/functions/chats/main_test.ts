// supabase/functions/chats/main_test.ts

import { assertEquals } from "https://deno.land/std@0.203.0/testing/asserts.ts";
import { handler } from "./index.ts"; // Adaptation : extrait la fonction à tester depuis index.ts



Deno.test("POST / - should return 400 if request body is invalid", async () => {
  const request = new Request("http://localhost:8000", {
    method: "POST",
    body: JSON.stringify({ type: "direct" }), // missing participantIds
    headers: {
      "Authorization": "Bearer fake-token",
      "Content-Type": "application/json",
    },
  });

  const response = await handler(request); // ici handler est la logique extraite de `Deno.serve()`
  const body = await response.json();

  assertEquals(response.status, 400);
  assertEquals(body.error, "Invalid request body");
});

Deno.test("PUT / - should return 400 if chatId or messageId missing", async () => {
  const request = new Request("http://localhost:8000?chatId=abc", {
    method: "PUT",
    headers: {
      "Authorization": "Bearer fake-token",
    },
  });

  const response = await handler(request);
  const body = await response.json();

  assertEquals(response.status, 400);
  assertEquals(body.error, "Missing required parameters");
});
