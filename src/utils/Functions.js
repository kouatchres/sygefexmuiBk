const uniqueCodeGen = (keyLength) => {
  var i,
    key = "",
    //  characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    characters =
      "abcdefghijklmnopqrstuvwxyzABCDEF@#$%&GHIJKLMNOPQRSTUVWXYZ0123456789";

  var charactersLength = characters.length;

  for (i = 0; i < keyLength; i++) {
    key += characters.substr(
      Math.floor(Math.random() * charactersLength + 1),
      1
    );
  }

  return key;
};

const objectFromCode = (codeValue) => {
  const storedObject = {
    candCode: `${codeValue}`,
  };
  return storedObject;
};

const getObjectFromID = (suppliedID) => {
  const theObject = {
    id: `${suppliedID}`,
  };
  return theObject;
};

const centerExamSessionObjectFromCode = (codeValue) => {
  const storedObject = {
    centerExamSession: `${codeValue}`,
  };
  return storedObject;
};

const candExamSessionCode = (candID, examID, sessionID) => {
  return `${candID + examID + sessionID}`;
};

const getSelectedObject = (dataSource, objectID) => {
  // 1 copy the data source
  if (dataSource.length > 0) {
    const tempObjects = [...dataSource];
    // get the object
    const selectedObject = tempObjects.find((item) => item.id === objectID);
    return selectedObject;
  }
};

const getSpecialtyID = (dataSource, CESSID) => {
  // 1 copy the data source
  if (dataSource) {
    const tempObjects = [...dataSource];
    // get the object
    const selectedObject = tempObjects.find((item) => item.id === CESSID);
    const { specialty } = { ...selectedObject };
    return specialty;
  }
};
// function to model a number with leading zeroes
Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

const calcCandAve = (candScores) => {
  const aveTotal =
    candScores &&
    candScores.reduce((tally, item) => tally + item.subjectAve * item.coeff, 0);
  const coeffTotal = candScores.reduce(
    (tally, item) => (item.subjectAve === null ? tally : tally + item.coeff),
    0
  );
  const candAve = aveTotal / coeffTotal;
  return candAve;
};
const calcCandTotalScore = (candScores) => {
  const aveTotal =
    candScores &&
    candScores.reduce((tally, item) => tally + item.subjectAve * item.coeff, 0);
  return aveTotal;
};
const calcCandTotalCoeff = (candScores) => {
  const coeffTotal =
    candScores &&
    candScores.reduce(
      (tally, item) => (item.subjectAve === null ? tally : tally + item.coeff),
      0
    );
  return coeffTotal;
};
const roundFloatNumber = (value, decimals) => {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
};

const removeTypename = (value) => {
  if (value === null || value === undefined) {
    return value;
  } else if (Array.isArray(value)) {
    return value.map((v) => removeTypename(v));
  } else if (typeof value === "object") {
    const newObj = {};
    Object.entries(value).forEach(([key, v]) => {
      if (key !== "__typename") {
        newObj[key] = removeTypename(v);
      }
    });
    return newObj;
  }
  return value;
};

const uploadFile = async (e) => {
  const files = e.target.files;
  const data = new FormData();
  data.append("file", files[0]);
  data.append("upload_preset", "ineximages");
  const res = await fetch("https://api.cloudinary.com/v1_1/inex/image/upload", {
    method: "POST",
    body: data,
  });
  const file = await res.json();
  console.log(file);
  // this.setState({ image: file.secure_url });
  setState({ image: file.secure_url });
};

// const updateCacheForDelete = (cache, { data }, queryToUpdate) => {
//   // manually update the cache so that the data are all the same
//   // 1. read the cache for the data we want
//   const { regions, deleteRegion } = data
//   const data = cache.readQuery({ query: queryToUpdate });
//   // selects all the other regions leaving out the deleted one
//   regions = regions.filter(region => region.id !== deleteRegion.id);
//   //  3. write the new data back to the cache
//   console.log("getting payload");
//   console.log(payload);
//   cache.writeQuery({ query: queryToUpdate, data });
// };

const updateCache = (cache, payload) => {
  // manually update the cache so that the data are all the same
  // 1. read the cache for the data we want
  const data = cache.readQuery({ query: getAllRegionsQuery });
  // the deletedselect all the other regions except the deleted one from the cache
  data.regions = data.regions.filter(
    (region) => region.id !== payload.data.deleteRegion.id
  );
  //  3. write the new data back to the cache
  console.log("getting payload");
  console.log(payload);
  cache.writeQuery({ query: getAllRegionsQuery, data });
};
module.exports = {
  candExamSessionCode,
  roundFloatNumber,
  calcCandTotalScore,
  calcCandTotalCoeff,
  calcCandAve,
  objectFromCode,
  uniqueCodeGen,
  getSelectedObject,
  getObjectFromID,
  removeTypename,
  uploadFile,
  getSpecialtyID,
  centerExamSessionObjectFromCode,
};
