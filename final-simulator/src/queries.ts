// Define the type for queries object
type QueriesType = {
  [key: string]: string[];
};

// Define your queries object
const queries: QueriesType = {
  "1": [
    "Bản tin về một giải đấu thể thao ở vùng biển. Có 2 vận động viên lướt sóng xuất hiện trong khung hình toàn cảnh ban đầu",
    "Sau đó chúng ta được thấy cận cảnh phần thi đấu của từng vận động viên, theo thứ tự vận động viên mặc áo màu trắng rồi đến vận động viên mặc áo màu đỏ",
    "Vận động viên áo đỏ 16 tuổi đến từ Nhật Bản đã giành ngôi vị quán quân.",
    "Cảnh quay cuối cùng chúng ta được thấy 2 vận động viên cùng đứng trên bục trao giải.",
    "L03_V025",
    "[28059, 28801]",
  ],
  "2": [
    "Bản tin về khung cảnh trang trí giáng sinh trên một khu phố ở châu Âu. Có rất nhiều tác phẩm nghệ thuật ánh sáng dọc theo con đường.",
    "Sau đó là hình ảnh của những cửa hàng trang trí đèn led theo chủ đề giáng sinh. Có một cửa hàng trang trí phỏng theo một tựa game nổi tiếng.",
    "Có một mô hình bàn cờ vua trong đó các quân cờ được mô phỏng theo các nhân vật trong tựa game đó.",
    "Tựa game được nhắc đến trong query này là tựa game nào?",
    "L03_V011",
    "[24091, 24206]",
    "MineCraft",
  ],
  "3": [
    "Bản tin về lễ hội hoa sen ở một tỉnh miền Tây. Có nhiều người phụ nữ đang chụp hình trong đầm sen đấy.",
    "Các người phụ nữ mặc áo dài nhiều màu, cầm theo nón lá, trong đó có một người phụ nữ mặc áo màu đỏ.",
    "Sau đó họ chuyển qua chụp hình luân phiên trên một chiếc thuyền sen.",
    "Cuối bản tin ta có thể thấy 2 người phụ nữ trên chiếc thuyền, trong đó có một người được nhắc đến trong gợi ý đầu tiên.",
    "L16_V010",
    "[09274, 10114]",
  ],
  "4": [
    "Bản tin về tình hình hàng không nội địa vào dịp tết. Mở đầu đoạn tin có thể  thấy khung cảnh sân bay với 3 máy bay của 3 hãng nội địa Việt Nam đang ở bến đỗ.",
    "Các máy bay đậu ở vị trí gần nhất và xa nhất đều là máy bay của hãng Vietnam Airlines.",
    "Tiếp đến có là cảnh hành khách đang xếp hàng làm thủ tục an ninh, trong đó có 3 người phụ nữ mặc áo màu theo thứ tự từ trái qua phải đỏ, kem, vàng.",
    "Hỏi đồng hồ ở sân bay chỉ mấy giờ mấy phút vào lúc này?",
    "L09_V018",
    "[01309, 02043]",
    "8:49",
  ],
  "5": [
    "Bản tin về việc mặc trang phục áo dài truyền thống ở công sở ở một địa phương miền Nam.",
    "Mở đầu bản tin có thể thấy 2 nhóm phụ nữ, trong đó một nhóm có 2 người mặc áo màu hồng và 2 người mặc áo màu vàng đang tiến đến gần nhóm còn lại.",
    "Sau đó là cảnh phỏng vấn một người phụ nữ mặc áo dài hoa đang ngồi trong văn phòng.",
    "Cuối cùng là chào cờ đầu tuần ở một đơn vị nhà nước, trong đó có nhiều người phụ nữ mặc áo dài.",
    "L12_V004",
    "[06364, 06974]",
  ],
  "6": [
    "Cảnh quay một khu triển lãm. Có 2 cái vật dụng nhìn giống một cái lọ, ở bên tay trái gần với camera nhất.",
    "Tiếp theo có một người đang nhìn vào một đồng hồ với mặt đồng hồ đằng trước và ở trên có một mô hình giống cái tháp nhỏ.",
    "Tiếp theo là cảnh quay các bức tranh đựng lồng trong những chiếc khung bằng vàng. Từ trái qua phải lần lượt là các khung hình chữ nhật, hình elip và hình elip.",
    "",
    "L14_V002",
    "16634",
  ],
  "7": [
    "Đoạn phim quay lại một khu vực được trang trí bởi rất nhiều đèn led. Những đèn led này được trang trí với tạo hình giống như bông hoa sen, con bướm, con nhện, hoặc những quả bí ngô halloween.",
    "Có một người đang mặc áo khoác dài, đeo kính chụp tại khu vực tạo hình con bướm.",
    "Kết thúc đoạn phim quay cảnh cậu bé chụp với khối cầu ngũ giác có đèn bên trong màu xanh lá.",
    "",
    "L06_V024",
    "17851",
  ],
  "8": [
    "Một chiếc mồi câu đang thả xuống dưới nước. Miếng mồi này nhìn giống một con cá, màu bạc.",
    "Tiếp theo cảnh chuyển qua một người làm động tác nâng lên hạ xuống chiếc cần câu. Người này đang đội nón trắng.",
    "Video quay cảnh xung quanh thì cũng có nhiều người đang bắt cá.",
    "Có người bắt được một con cá và con cá này vùng vẫy khi bị câu lên.",
    "L07_V025",
    "123123",
    "456456"
  ],
  "9": [
    "Bản tin về khung cảnh dưới biển, có các chú cá bơi xung quanh người thợ lặn, phía trên có một con thuyền cùng thực hiện hoạt động với người thợ lặn",
    "những người thợ lặn đang khám phá các rặng san hô, sau đó máy quay chuyển cảnh đến những chú cá bơi vào ra từng rặng san hô",
    "Có một chú cá màu xanh bơi trực diện đâm vào máy quay",
    "Đây là bản tin về tình trạng san hô ở khu vực hòn rơm, nha trang và các hoạt động bảo tồn đáy biển",
    "L17_V029",
    "08640",
  ],
  "10": ["37", "38", "39", "40"],
  "11": ["41", "42", "43", "44"],
  "12": ["45", "46", "47", "48"],
  "13": [
    "Bản tin về giáng sinh tại một thành phố ở châu Âu.",
    "Có đèn trang trí ở phía trên các con đường giữa các toàn nhà.",
    "Có các đèn trang trí hình con cá, hình lập phương có một viên ngọc màu đỏ ở giữa.",
    "Cuối cùng là hình ảnh cây thông với rất nhiều đèn được quấn xung quanh.",
    "123123",
    "456456",
  ],
  "14": ["53", "54", "55", "56"],
  "15": ["57", "58", "59", "60"],
  "16": ["61", "62", "63", "64"],
  "17": ["65", "66", "67", "68"],
  "18": ["69", "70", "71", "72"],
  "19": ["73", "74", "75", "76"],
  "20": ["77", "78", "79", "80"],
  "21": ["81", "82", "83", "84"],
  "22": ["85", "86", "87", "88"],
  "23": ["89", "90", "91", "92"],
  "24": ["93", "94", "95", "96"],
  "25": ["97", "98", "99", "100"],
  "26": ["101", "102", "103", "104"],
  "27": ["105", "106", "107", "108"],
  "28": ["109", "110", "111", "112"],
  "29": ["113", "114", "115", "116"],
  "30": ["117", "118", "119", "120"],
};

export default queries;