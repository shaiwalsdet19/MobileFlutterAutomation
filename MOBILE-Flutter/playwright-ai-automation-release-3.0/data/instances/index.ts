import fs from "fs";
import path from "path";

export interface Credentials {
  username: string;
  password: string;
  tenant_id?: string;
}

export interface RolesData {
  instanceId?: string;
  tenantId?: string;
  baseUrl: string;
  matchHostnames?: string[];
  roleAliases: Record<string, string>;
  roles: Record<string, Credentials | Credentials[]>;
}

const dataDir = path.join(__dirname);

function readJson<T>(filePath: string): T {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

/**
 * Resolves a roleId to credentials for a given instance.
 * If the role maps to an array, returns credentials at employeeIndex (default 0),
 * or the full array when `returnAll` is true.
 */
export function resolveRole(
  instance: string,
  roleId: string,
  employeeIndex = 0,
  returnAll = false
): Credentials | Credentials[] {
  const filePath = path.join(dataDir, instance, "roles.json");
  const rolesData = readJson<RolesData>(filePath);

  const aliasedRole = rolesData.roleAliases[roleId] ?? roleId;
  const entry = rolesData.roles[aliasedRole];

  if (!entry) {
    throw new Error(
      `Role "${roleId}" (alias "${aliasedRole}") not found in ${filePath}`
    );
  }

  if (returnAll) {
    return Array.isArray(entry) ? entry : [entry];
  }

  return Array.isArray(entry) ? (entry[employeeIndex] ?? entry[0]) : entry;
}

export function getBaseUrl(instance: string): string {
  const filePath = path.join(dataDir, instance, "roles.json");
  const rolesData = readJson<RolesData>(filePath);
  const url = rolesData.baseUrl;
  return url.endsWith("/") ? url : `${url}/`;
}

/**
 * Returns the tenantId declared for a given instance.
 */
export function getTenantId(instance: string): string {
  const filePath = path.join(dataDir, instance, "roles.json");
  const rolesData = readJson<RolesData>(filePath);
  if (!rolesData.tenantId) {
    throw new Error(`tenantId is not configured in ${filePath}`);
  }

  return String(rolesData.tenantId);
}


export function getDboxUILibraryBasePath(file: string, instance: string = ''){
  const basePath = !!instance ? `https://${instance}.qa.darwinbox.io/ms/dboxuilibrary/assets/dboxuilib_dist/www` : 'http://localhost:3333';
  return path.join(basePath, file);

}