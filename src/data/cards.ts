import { CharacterCard } from '../types';

export const CHARACTER_CARDS: CharacterCard[] = [
  {
    id: 'tran-hung-dao',
    name: 'Hưng Đạo Đại Vương Trần Quốc Tuấn',
    title: 'Vạn Kiếp Thần Tướng · Tiết Chế Thống Lĩnh',
    type: 'history',
    era: 'Thế kỷ XIII (Nhà Trần)',
    location: 'Bạch Đằng Giang – Vạn Kiếp (Hải Dương)',
    rarity: 'legendary',
    quote: '“Ta thường tới bữa quên ăn, nửa đêm vỗ gối, ruột đau như cắt, nước mắt đầm đìa...”',
    bio: 'Vị danh tướng lỗi lạc 3 lần đánh bại quân xâm lược Nguyên Mông hùng mạnh bậc nhất thế giới, tác giả của thiên cổ hùng văn “Hịch tướng sĩ” và “Binh thư yếu lược”.',
    imageUrl: '/src/assets/images/card_tran_hung_dao_1790757748746.jpg',
    stats: {
      historySkill: 99,
      geoSkill: 95,
      litSkill: 92
    }
  },
  {
    id: 'vo-nguyen-giap',
    name: 'Đại Tướng Võ Nguyên Giáp',
    title: 'Anh Cả Quân Đội · Thần Tốc Quyết Thắng',
    type: 'history',
    era: 'Thế kỷ XX (Thời đại Hồ Chí Minh)',
    location: 'Điện Biên Phủ – Tây Bắc – Trường Sơn',
    rarity: 'legendary',
    quote: '“Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa; tranh thủ từng phút, từng giờ; xốc tới miền Nam. Quyết chiến và toàn thắng!”',
    bio: 'Tổng tư lệnh tối cao của Quân đội Nhân dân Việt Nam, người chỉ huy làm nên chiến thắng Điện Biên Phủ “lừng lẫy năm châu” và chiến dịch Hồ Chí Minh lịch sử năm 1975.',
    imageUrl: '/src/assets/images/card_vo_nguyen_giap_1790757791089.jpg',
    stats: {
      historySkill: 99,
      geoSkill: 98,
      litSkill: 88
    }
  },
  {
    id: 'nguyen-du',
    name: 'Đại Thi Hào Nguyễn Du',
    title: 'Tố Như Tiên Sinh · Danh Nhân Văn Hóa',
    type: 'literature',
    era: 'Thế kỷ XVIII – XIX (Triều Nguyễn sơ)',
    location: 'Tiên Điền (Hà Tĩnh) – Kinh thành Huế',
    rarity: 'legendary',
    quote: '“Trăm năm trong cõi người ta / Chữ tài chữ mệnh khéo là ghét nhau / Trải qua một cuộc bể dâu / Những điều trông thấy mà đau đớn lòng.”',
    bio: 'Đại thi hào dân tộc, Danh nhân văn hóa thế giới, tác giả kiệt tác “Truyện Kiều” – đỉnh cao rực rỡ của nghệ thuật ngôn từ và tư tưởng nhân đạo Việt Nam.',
    imageUrl: '/src/assets/images/card_nguyen_du_1790757814539.jpg',
    stats: {
      historySkill: 88,
      geoSkill: 86,
      litSkill: 100
    }
  },
  {
    id: 'nguyen-trai',
    name: 'Ức Trai Nguyễn Trãi',
    title: 'Khai Quốc Công Thần · Vạn Thế Sư Biểu',
    type: 'literature',
    era: 'Thế kỷ XV (Nhà Hậu Lê)',
    location: 'Côn Sơn (Chí Linh, Hải Dương) – Thăng Long',
    rarity: 'epic',
    quote: '“Việc nhân nghĩa cốt ở yên dân / Quân điếu phạt trước lo trừ bạo.”',
    bio: 'Khai quốc công thần cuộc khởi nghĩa Lam Sơn, danh nhân văn hóa thế giới, tác giả của bản thiên cổ hùng văn “Bình Ngô đại cáo” và tập thơ “Quốc âm thi tập”.',
    imageUrl: '/src/assets/images/arena_hero_banner_1790757687116.jpg',
    stats: {
      historySkill: 95,
      geoSkill: 92,
      litSkill: 98
    }
  },
  {
    id: 'ngo-quyen',
    name: 'Tiền Ngô Vương Ngô Quyền',
    title: 'Vua Mở Nền Độc Lập · Trận Thần Cọc Nhọn',
    type: 'history',
    era: 'Năm 938 (Thời kỳ dựng nền tự chủ)',
    location: 'Cửa sông Bạch Đằng – Cổ Loa (Đông Anh)',
    rarity: 'epic',
    quote: '“Nếu ta sai người cắm cọc vạt nhọn ngầm ở cửa biển, thuyền giặc nhân triều dâng vào, triều rút cọc nhô lên tất phá được!”',
    bio: 'Vị anh hùng dân tộc với mưu lược đóng cọc nhọn bọc sắt trên sông Bạch Đằng năm 938, chấm dứt hơn 1000 năm Bắc thuộc, mở ra kỷ nguyên độc lập tự chủ lâu dài.',
    imageUrl: '/src/assets/images/card_tran_hung_dao_1790757748746.jpg',
    stats: {
      historySkill: 97,
      geoSkill: 96,
      litSkill: 80
    }
  },
  {
    id: 'to-huu',
    name: 'Nhà Thơ Tố Hữu',
    title: 'Lá Cờ Đầu Thơ Ca Cách Mạng',
    type: 'literature',
    era: 'Thế kỷ XX (Kháng chiến chống Pháp & Mỹ)',
    location: 'Huế – Căn cứ chiến khu Việt Bắc – Hà Nội',
    rarity: 'rare',
    quote: '“Từ ấy trong tôi bừng nắng hạ / Mặt trời chân lý chói qua tim / Hồn tôi là một vườn hoa lá / Rất đậm hương và rộn tiếng chim...”',
    bio: 'Cánh chim đầu đàn của nền thơ ca cách mạng Việt Nam với các thi phẩm vang dội: “Từ ấy”, “Việt Bắc”, “Gió lộng”, “Ra trận”, “Máu và Hoa”.',
    imageUrl: '/src/assets/images/card_nguyen_du_1790757814539.jpg',
    stats: {
      historySkill: 90,
      geoSkill: 85,
      litSkill: 95
    }
  },
  {
    id: 'ba-huyen-thanh-quan',
    name: 'Bà Huyện Thanh Quan',
    title: 'Nữ Sĩ Hoài Cổ · Cung Trung Giáo Tập',
    type: 'literature',
    era: 'Thế kỷ XIX (Thời Nguyễn)',
    location: 'Nghi Tàm (Hà Nội) – Đèo Ngang (Hà Tĩnh – Quảng Bình)',
    rarity: 'rare',
    quote: '“Bước tới Đèo Ngang bóng xế tà / Cỏ cây chen đá, lá chen hoa / Lom khom dưới núi tiều vài chú / Lác đác bên sông chợ mấy nhà...”',
    bio: 'Một trong những nữ sĩ tài danh hiếm có của nền văn học trung đại, nổi tiếng với phong cách thơ Đường luật mẫu mực, điêu luyện và nỗi hoài cổ u trầm.',
    imageUrl: '/src/assets/images/card_nguyen_du_1790757814539.jpg',
    stats: {
      historySkill: 85,
      geoSkill: 90,
      litSkill: 96
    }
  },
  {
    id: 'hoang-phu-ngoc-tuong',
    name: 'Hoàng Phủ Ngọc Tường',
    title: 'Ký Giả Xứ Huế · Bút Hoa Thần Bút',
    type: 'literature',
    era: 'Thế kỷ XX (Văn học hiện đại)',
    location: 'Thừa Thiên Huế – Dòng sông Hương',
    rarity: 'rare',
    quote: '“Hình như trong khoảnh khắc chùng lại của sông nước ấy, sông Hương đã trở thành một người tình e ấp ngập ngừng...”',
    bio: 'Bậc thầy về thể loại tùy bút và bút ký văn học, với vốn tri thức uyên bác về lịch sử, địa lý và văn hóa cố đô qua tác phẩm “Ai đã đặt tên cho dòng sông?”.',
    imageUrl: '/src/assets/images/arena_hero_banner_1790757687116.jpg',
    stats: {
      historySkill: 88,
      geoSkill: 95,
      litSkill: 94
    }
  }
];
