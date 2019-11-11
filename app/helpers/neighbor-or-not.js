import { helper } from '@ember/component/helper';

export default helper(function([kn, row, col]) {
  let isNeighbor = false;
  let concat = row.toString() + "-" + col.toString();
  if(kn[concat] != undefined) {
    isNeighbor = true;
  }
  return isNeighbor;
  
});
