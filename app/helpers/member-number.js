import { helper } from '@ember/component/helper';

export default helper(function memberNumber([kn, row, col]) {
  let memberNumber;
  let concat = row.toString() + "-" + col.toString();
  if(kn[concat] != undefined) {
    memberNumber = kn[concat];
  }
  //Make it look pretty and synch up the array count with human count
  return memberNumber + 1;
});
