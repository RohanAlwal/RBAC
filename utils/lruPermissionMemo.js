const MAX_CACHE_SIZE = 20;

const permissionMemoCache = new Map();

const getCacheKey = (userId, permissionName) => {
    return `${userId}: ${permissionName}`;
}

const setPermissionMemo = (userId, permissionName, result) => {
    const key = getCacheKey(userId, permissionName);

    if(permissionMemoCache.has(key)){
        permissionMemoCache.delete(key);
    }

    permissionMemoCache.set(key, result);

    if(permissionMemoCache.size > MAX_CACHE_SIZE){
        const oldestKey = permissionMemoCache.keys().next().value;
        permissionMemoCache.delete(oldestKey);
    }
};

const getPermissionMemo = (userId, permissionName) => {
    const key = getCacheKey(userId, permissionName);
    if(!permissionMemoCache.has(key)) return undefined;

    const value = permissionMemoCache.get(key);
    permissionMemoCache.delete(key);
    permissionMemoCache.set(key, value);

    return value;
};

module.exports = { setPermissionMemo, getPermissionMemo };