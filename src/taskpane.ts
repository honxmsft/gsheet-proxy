/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// images references in the manifest
// import "../../assets/icon-16.png";
// import "../../assets/icon-32.png";
// import "../../assets/icon-80.png";

// preload
import { transformSynchronousCodeForBatchExecution, library } from 'office-script-synchronous'

/* global console, document, Excel, Office */
import { getEditor } from './editor';
import { compileAndGenMock } from './inference';

// TODO: move to iframe?
import preload from '../libs/index?raw'
import appScript from '../sample/index?raw'
import { compileCode } from './compileCode';
const scriptDynamic = document.getElementById('dynamic')!;

function getSetSupport(
  sets: { name: string; version: string }[],
): { name: string; version: string; support: boolean }[] {
  const supportedSets = sets.map(({ name, version }) => {
    const support = Office.context.requirements.isSetSupported(name, version);
    return {
      name,
      version,
      support,
    };
  });

  return supportedSets;
}

async function transpileGoogle(content: string) {
  const output = await transformSynchronousCodeForBatchExecution(content, compileCode, {
    getSetSupport,
    logger: {
      log(message) {
        console.log(`DEBUG: ${message}`)
      }
    },
    scan: true,
  })
  const result = output.outputText!.replace(`"use strict"`, '')
  console.log(result)
  // load excel script
  // window.ExcelScript = library
  // load main
  scriptDynamic.innerHTML = `${result}; window.main = main`
  // call code
  await Excel.run(async (ctx) => {
    await window.main(ctx)
    // await new Promise((resolve) => {

    // })
  })
}

Office.onReady(async (info) => {
  if (info.host === Office.HostType.Excel) {
    transpileGoogle(`
    function main(workbook: ExcelScript.Workbook) {
      ${preload}
      ${appScript}
    }
    `)
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
