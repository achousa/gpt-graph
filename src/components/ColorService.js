
const colorList = ['#ed3e19', '#b64128', '#e3c727', '#ffee8f', '#3fafeb', '#057ebe', '#875fc8', '#77d88f', '#2c8040', '#f557d4', '#987fdf', '#4aeed5', '#dec19e', '#dade9e', '#cf7483', '#21e7d5', '#8a2c56', '#c8e802','#5c3500','#69926e', '#905e8e', '#5462ea', '#136158', '#7b805c', '#7f3bd6', '#00325c', '#e839e3', '#cfaa2e', '#c6d7e5', '#008cff', '#5938cb', '#00ff23', '#614e7a', '#8bcf2e', '#941414', '#d4ffd9', '#8e8050', '#ff187e', '#bcbbbb', '#a3de1b', '#e6f3c5', '#d8ff76', '#a58ef4', '#7c9db8', '#bab0dc', '#b7ff00', '#4a3e73', '#795e9c'];

export default class ColorService {

  static calculateHash(data) {
    if(!data) {
      return 1;
    }
    let hash = 5381;
    for (let i = 0; i < data.length; i++) {
      hash = (hash * 33) + data.charCodeAt(i);
    }
    return (hash % colorList.length) + 1;
  }

  static getColor(data) {
    return colorList[this.calculateHash(data)]
  }

}
