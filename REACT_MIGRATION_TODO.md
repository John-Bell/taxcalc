# React Migration TODO List

This document outlines the steps to migrate C# console app service logic to a new React project, focusing on one service at a time. UI components will be added later.

## General Steps

1. Set up a new React project (if not already done).
2. Create a folder structure for services (e.g., `src/services`).
   - **Note:** Keep folders flat and predictable. Use clear, purpose-driven folder names.
3. Choose a service to start with (e.g., `GeneralTaxService`).
4. Analyze the C# service logic and identify dependencies and models.
5. Port the selected service logic to a JavaScript/TypeScript module in `src/services`.
6. Port any required models (e.g., `BrbTracker`) to TypeScript interfaces/types in `src/models`.
7. Write unit tests for the new service logic using Jest (in `src/__tests__` or similar).
8. Verify the logic matches the C# implementation by comparing test results.
9. Commit changes in a dedicated branch for this service.
10. Repeat steps 3 to 9 for each additional service, using a new branch each time.
11. (Later) Plan and implement UI components to interact with the ported services.

> **Note:** UI components are not required at this stage. Focus on service logic and tests for incremental migration.
