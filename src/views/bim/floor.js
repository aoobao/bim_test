let temp =
  'node_-2f_-4638|B2F,node_-1f_-4636|B1F,node_ground_-4658|ground,node_1f_-4640|1F,node_2f_-4642|2F,node_3f_-4644|3F,node_4f_-4646|4F,node_5f_-4648|5F,node_6f_-4650|6F,node_7f_-4652|7F,node_8f_-4654|8F,node_9f_-4656|9F'

let list = temp.split(',')

let arr = []

for (let i = 0; i < list.length; i++) {
  const re = list[i].split('|')
  let obj = {
    meshName: re[0],
    floorName: re[1],
    sort: i
  }
  arr.push(obj)
}

export default arr
