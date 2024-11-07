"use server";

export async function CreateUser(data) {
  const res = await fetch(`${process.env.BACKEND_URL}/users`, {
    headers: {
      "cache-control": "no-cache",
      "content-type": "application/json",
      authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6IjY3MjM2YWRhN2U4ZjhiY2U3ZGZiZWE5NSIsInJvbGVzIjpbIkFETUlOIl0sImlhdCI6MTczMDgwNjcwMywiZXhwIjoxNzMwODkzMTAzfQ.BDs0LuvQ2SMIk6NJ5xlL0tz7mfeTrGPesU54Yw_Iwis`,
    },
    cache: "no-cache",
    body: JSON.stringify({
      ...data,
    }),
    method: "POST",
  });
  const result = await res.json();
  return {
    status: res.status,
    body: result,
  };
}
