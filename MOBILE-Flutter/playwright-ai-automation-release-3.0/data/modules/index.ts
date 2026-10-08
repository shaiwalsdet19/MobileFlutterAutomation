import fs from "fs";
import path from "path";

const modulesDir = __dirname;

function normalizeDataFileName(dataFileName: string): string {
  return dataFileName.endsWith(".json") ? dataFileName : `${dataFileName}.json`;
}

export function getModuleData<T>(moduleName: string, dataFileName: string): T {
  const filePath = path.join(modulesDir, moduleName, normalizeDataFileName(dataFileName));

  if (!fs.existsSync(filePath)) {
    throw new Error(`Module data file not found: ${filePath}`);
  }

  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}
