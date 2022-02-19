const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)

// getAge('1994-06-14') // 23
// getAge('1994-06-13') // 24
// console.log(getAge('2000-1-13'));
exports.getAge = getAge;