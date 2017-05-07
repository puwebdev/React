export const orderLowercase = (a, b) => { 
    return String(a).toLowerCase() > String(b).toLowerCase() ? 1 : -1;
}

export const getParentUrl = (parentId) => {
  let parentIdsOfParent = window.app3dViewsNav.treePathOfInfowin[parentId],
      idOfParent = null,
      parentType;

  if (parentIdsOfParent && parentIdsOfParent.length) {
      idOfParent = parentIdsOfParent[parentIdsOfParent.length - 1];
      parentType = parentIdsOfParent.length === 1 ? "world" : "infowin";
  }

  let str = idOfParent ?
      `/infowins/${parentType}/${idOfParent}/${parentId}`
      : "/infowins/";

  return str;
}