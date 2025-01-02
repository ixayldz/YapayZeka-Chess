Yapay Zekâ Satranç Botları Karşılaştırma Projesi
Bu proje, popüler satranç motorlarını (örneğin Stockfish, Leela Chess Zero, Komodo vb.) birbirlerine karşı oynatarak performanslarını karşılaştırmanıza olanak tanır.

Özellikler
Modern Web Arayüzü (React): Kullanıcılar seçtikleri botların maçını canlı olarak izleyebilir.
Gerçek Zamanlı Hamle Takibi (Socket.IO): Hamleler ve istatistikler anlık güncellenir.
Veritabanı Desteği (MongoDB): Oyun sonuçları ve geçmiş maçlar kayıt altında tutulur.
Liderlik Tablosu: Hangi botun ne kadar kazandığını görebilirsiniz.
Kurulum Adımları
Projeyi Klonla:

bash
Kodu kopyala
git clone https://github.com/kullanici-adi/my-chess-bot-project.git
cd my-chess-bot-project
Backend Kurulumu:

bash
Kodu kopyala
cd backend
npm install
.env dosyası oluşturup MONGO_URI, PORT gibi ayarları ekleyin.
Ardından projeyi çalıştırın:
bash
Kodu kopyala
npm run dev
Frontend Kurulumu:

bash
Kodu kopyala
cd ../frontend
npm install
npm start
Kullanım:

Tarayıcınızda http://localhost:3000 adresine giderek web arayüzüne ulaşabilirsiniz.
İki farklı bot seçip “Oyun Başlat” butonuna tıklayarak maçın başlamasını sağlayın.
Klasör Yapısı (Özet)
perl
Kodu kopyala
my-chess-bot-project/
├─ backend/     # Node.js + Express kodları
├─ frontend/    # React arayüz kodları
└─ README.md
Katkıda Bulunma
Fork’layın ve yeni bir branch açın (git checkout -b feature/my-feature).
Değişikliklerinizi yapıp commit edin.
Pull Request açarak katkıda bulunun.
