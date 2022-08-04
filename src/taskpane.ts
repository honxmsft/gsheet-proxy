/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// images references in the manifest
// import "../../assets/icon-16.png";
// import "../../assets/icon-32.png";
// import "../../assets/icon-80.png";

// preload
Office.onReady(async (info) => {
  if (info.host === Office.HostType.Excel) {
    Excel.run(async (context) => {
      console.log('hello')
    })
  }
});

// getEditor()

async function tryCatch(callback: Function, ...args: any[]) {
  try {
    await callback(...args);
  } catch (error) {
    // Note: In a production add-in, you'd want to notify the user through your add-in's UI.
    console.error(error);
  }
}
