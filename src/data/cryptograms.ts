import { CryptogramItem } from '../types';

export const CRYPTOGRAM_ITEMS: CryptogramItem[] = [
  {
    id: 'crypto-01',
    verseOrExcerpt: '“Bước tới Đèo Ngang bóng xế tà / Cỏ cây chen đá, lá chen hoa / Lom khom dưới núi tiều vài chú / Lác đác bên sông chợ mấy nhà...”',
    authorOrSource: 'Trích thơ trung đại thế kỷ XIX',
    clues: {
      geoClue: 'Con đèo ranh giới tự nhiên hiểm trở giữa hai tỉnh Hà Tĩnh và Quảng Bình, thuộc dãy Hoành Sơn.',
      personClue: 'Nữ sĩ tài danh thời Nguyễn, từng giữ chức Cung Trung Giáo Tập dạy học cho cung phi công chúa.',
      workClue: 'Bài thơ thất ngôn bát cú Đường luật tuyệt tác mang tên con đèo.',
      historyClue: 'Thời kỳ nhà Nguyễn củng cố vương triều, phân định ranh giới và trạm dịch Bắc – Nam.'
    },
    answers: {
      location: 'Đèo Ngang (Dãy Hoành Sơn)',
      person: 'Bà Huyện Thanh Quan (Nguyễn Thị Hinh)',
      work: 'Qua Đèo Ngang',
      historyEvent: 'Triều Nguyễn định đô ở Huế & mở tuyến đường thiên lý Bắc – Nam'
    },
    options: {
      location: ['Đèo Ngang (Dãy Hoành Sơn)', 'Đèo Hải Vân', 'Đèo Pha Đin', 'Đèo Cù Mông'],
      person: ['Bà Huyện Thanh Quan', 'Hồ Xuân Hương', 'Đoàn Thị Điểm', 'Sương Nguyệt Anh'],
      work: ['Qua Đèo Ngang', 'Thăng Long thành hoài cổ', 'Chùa Trấn Bắc', 'Cảnh chiều hôm'],
      historyEvent: [
        'Triều Nguyễn định đô ở Huế & mở tuyến đường thiên lý Bắc – Nam',
        'Chiến tranh Trịnh – Nguyễn thế kỷ XVII',
        'Kháng chiến chống quân Thanh 1789',
        'Chiến dịch Điện Biên Phủ 1954'
      ]
    },
    interdisciplinaryLesson: 'Đèo Ngang là mắt xích địa lý hiểm trở thuộc ranh giới tự nhiên Hoành Sơn; văn chương của Bà Huyện Thanh Quan gắn với tâm sự hoài cổ thời kỳ vương triều nhà Nguyễn mở cõi.'
  },
  {
    id: 'crypto-02',
    verseOrExcerpt: '“Sông Đằng một dải sáng ghê / Sóng hồng cuồn cuộn tuôn về bể Đông / Khách ôi thuyền một lá lênh đênh / Thả chèo xem phong cảnh...”',
    authorOrSource: 'Thiên cổ phú thời Trần',
    clues: {
      geoClue: 'Cửa sông giáp ranh giữa Quảng Ninh và Hải Phòng, có chế độ bán nhật triều chênh lệch lớn.',
      personClue: 'Học giả, đại thần thời Trần phụng mệnh soạn phú khi qua thăm chiến địa xưa.',
      workClue: 'Bài phú chữ Hán nổi tiếng bậc nhất trong lịch sử văn học trung đại Việt Nam.',
      historyClue: 'Các chiến công oanh liệt đánh tan quân Nam Hán (938), quân Tống (981) và Nguyên Mông (1288).'
    },
    answers: {
      location: 'Sông Bạch Đằng',
      person: 'Trương Hán Siêu',
      work: 'Bạch Đằng giang phú',
      historyEvent: 'Ba lần đại thắng Bạch Đằng (938, 981, 1288)'
    },
    options: {
      location: ['Sông Bạch Đằng', 'Sông Lục Đầu', 'Sông Như Nguyệt', 'Sông Lô'],
      person: ['Trương Hán Siêu', 'Trần Hưng Đạo', 'Nguyễn Trãi', 'Chu Văn An'],
      work: ['Bạch Đằng giang phú', 'Hịch tướng sĩ', 'Dục Thúy sơn', 'Bạch Đằng hải khẩu'],
      historyEvent: [
        'Ba lần đại thắng Bạch Đằng (938, 981, 1288)',
        'Chiến thắng Ngọc Hồi – Đống Đa 1789',
        'Khởi nghĩa Lam Sơn 1418 – 1427',
        'Khởi nghĩa Hai Bà Trưng năm 40'
      ]
    },
    interdisciplinaryLesson: 'Thủy triều sông Bạch Đằng là chìa khóa địa lý quân sự tài tình giúp các tướng lĩnh Việt Nam lập nên 3 chiến thắng oanh liệt và đi vào áng phú kiệt xuất của Trương Hán Siêu.'
  },
  {
    id: 'crypto-03',
    verseOrExcerpt: '“Hoan hô chiến sĩ Điện Biên / Chiến sĩ anh hùng / Đầu nung lửa sắt / Năm mươi sáu ngày đêm khoét núi, ngủ hầm, mưa dầm, cơm vắt...”',
    authorOrSource: 'Thơ kháng chiến chống Pháp',
    clues: {
      geoClue: 'Thung lũng lòng chảo lòng Mường Thanh, bao quanh bởi núi đồi cao hiểm trở vùng Tây Bắc.',
      personClue: 'Nhà thơ lớn của phong trào Cách mạng Việt Nam, tác giả tập thơ “Gió lộng”, “Việt Bắc”.',
      workClue: 'Bài thơ viết trong niềm xúc động tột cùng khi nghe tin thắng trận năm 1954.',
      historyClue: 'Chiến dịch lịch sử đập tan cứ điểm Navarre, kết thúc 9 năm kháng chiến chống Pháp trường kỳ.'
    },
    answers: {
      location: 'Thung lũng Điện Biên Phủ (Tây Bắc)',
      person: 'Nhà thơ Tố Hữu',
      work: 'Hoan hô chiến sĩ Điện Biên',
      historyEvent: 'Chiến thắng lịch sử Điện Biên Phủ (07/05/1954)'
    },
    options: {
      location: ['Thung lũng Điện Biên Phủ (Tây Bắc)', 'Căn cứ Tân Trào (Tuyên Quang)', 'Đèo Pha Đin (Sơn La)', 'Chiến khu D (Đông Nam Bộ)'],
      person: ['Nhà thơ Tố Hữu', 'Chính Hữu', 'Quang Dũng', 'Hoàng Cầm'],
      work: ['Hoan hô chiến sĩ Điện Biên', 'Tây Tiến', 'Đồng chí', 'Bên kia sông Đuống'],
      historyEvent: [
        'Chiến thắng lịch sử Điện Biên Phủ (07/05/1954)',
        'Chiến dịch Biên giới Thu Đông 1950',
        'Chiến dịch Việt Bắc Thu Đông 1947',
        'Chiến dịch Hồ Chí Minh 1975'
      ]
    },
    interdisciplinaryLesson: 'Địa hình thung lũng lòng chảo Tây Bắc bị cô lập là tử huyệt của quân Pháp khi ta đưa pháo lên cao chế ngự, trở thành nguồn cảm hứng trường tồn cho thơ ca cách mạng Tố Hữu.'
  },
  {
    id: 'crypto-04',
    verseOrExcerpt: '“Dốc lên khúc khuỷu dốc thăm thẳm / Heo hút cồn mây súng ngửi trời / Ngàn thước lên cao ngàn thước xuống / Nhà ai Pha Luông mưa xa khơi...”',
    authorOrSource: 'Thơ ca thời kỳ đầu kháng chiến',
    clues: {
      geoClue: 'Dãy núi Pha Luông hùng vĩ, địa bàn biên giới miền Tây Bắc bộ giáp nước bạn Lào.',
      personClue: 'Nhà thơ chiến sĩ tài hoa gốc Hà thành, từng làm đại đội trưởng đoàn quân Tây Tiến.',
      workClue: 'Thi phẩm kiệt xuất khắc họa vẻ đẹp bi tráng của người lính trong những năm đầu kháng Pháp.',
      historyClue: 'Binh đoàn Tây Tiến thành lập năm 1947 phối hợp bảo vệ biên cương Tây Bắc Việt – Lào.'
    },
    answers: {
      location: 'Đỉnh Pha Luông & miền Tây Bắc bộ',
      person: 'Nhà thơ Quang Dũng',
      work: 'Tây Tiến',
      historyEvent: 'Binh đoàn Tây Tiến hành quân bảo vệ biên giới Tây Bắc (1947)'
    },
    options: {
      location: ['Đỉnh Pha Luông & miền Tây Bắc bộ', 'Dãy Trường Sơn', 'Rừng núi Ba Vì', 'Dãy Hoàng Liên Sơn'],
      person: ['Nhà thơ Quang Dũng', 'Thâm Tâm', 'Nguyễn Đình Thi', 'Hữu Thỉnh'],
      work: ['Tây Tiến', 'Đất nước', 'Tiếng hát con tàu', 'Ánh trăng'],
      historyEvent: [
        'Binh đoàn Tây Tiến hành quân bảo vệ biên giới Tây Bắc (1947)',
        'Chiến dịch Điện Biên Phủ 1954',
        'Cách mạng Tháng Tám 1945',
        'Khởi nghĩa Ba Tơ 1945'
      ]
    },
    interdisciplinaryLesson: 'Địa hình núi rừng heo hút, cheo leo của Pha Luông và Tây Bắc bộ tôi luyện ý chí sắt đá và tâm hồn hào hoa, lãng mạn của thế hệ thanh niên kháng chiến qua ngòi bút Quang Dũng.'
  }
];
