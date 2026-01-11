When adding a new feature follow these instructions
Our code lives under .src, it is then split further into 3 folders Main, preload and Render.
Main holds business logic and persistance information.
Preload holds logic to expose Main functionality to Render.
Render holds display logic.

Before writing any code we must first answer a few questions to ensure we know exactly what we want from a feature.

1. What state needs to be tracked?
2. Where will that state come from?
3. What user interactions will be needed?
4. How will user interactions change the state?

Once we have an outline of requirements we can start writing code by following the instructions below.

1. Add a new folder under src/Main/Features with the name of the feature
2. Add a index.ts file under that new folder which will contain the business logic for the feature.
3. Add a function which will implement the event handlers for the feature
4. Under src/Main/store.ts add a call to the new function made in step 3. Then in the same file add the created handlers to the store.setState() function call.
5. Update src/Main/Features/index.ts to add any state that needs to be tracked and any events that need to be handled
