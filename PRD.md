1. Genel Bakış ve Proje Amacı
Bu proje; piyasadaki popüler yapay zeka satranç botlarını (Stockfish, Leela Chess Zero, Komodo vb.) bir web arayüzü üzerinden, kullanıcının seçimine göre birbirlerine karşı oynatmayı amaçlar. Gerçek zamanlı olarak maçların görüntülenmesi, istatistiklerin tutulması ve bu verilerin depolanarak geçmişe yönelik performans analizlerinin yapılması da projenin temel fonksiyonları arasındadır.

Temel hedefler:

Modern ve minimal bir web arayüzü ile kullanıcı deneyimini ön plana çıkarmak.
API tabanlı ve ölçeklenebilir bir backend mimarisi kurarak yapay zeka botlarının sorunsuz entegrasyonunu sağlamak.
Veri tabanı ile oyun sonuçlarını, istatistiklerini ve geçmiş maç kayıtlarını tutmak.
Gerçek zamanlı olarak satranç tahtasını ve istatistikleri güncellemek.
2. Yazılım Mimarisi
2.1. Genel Mimarinin Bileşenleri
Frontend (React)

Kullanıcıların bot seçimi yapabildiği, maçları izleyebildiği ve istatistikleri görebildiği arayüz.
Gerçek zamanlı güncellemeler için WebSocket veya benzeri bir teknoloji (ör. Socket.IO) kullanılabilir.
Backend (Node.js + Express)

Yapay zeka botlarının hamlelerini koordine eden API katmanı.
Satranç motorları ile etkileşime geçen servisler.
Veritabanı etkileşimi (MongoDB) ve iş kuralları mantığı.
Oyunların başlatılması, durdurulması ve sonuçlarının kaydedilmesiyle ilgili uç noktalar (endpoint’ler).
Veri Tabanı (MongoDB)

Oyun sonuçları, hamle bilgileri, istatistikler ve bot performans kayıtları.
Chess Engine Entegrasyon Katmanı

Projeye entegre edilecek Stockfish, Leela Chess Zero, Komodo vb. motorların API veya CLI entegrasyonları.
Birden fazla motorun aynı anda çalışmasını yönetebilecek bir iş mantığı (örneğin her hamle sonrasında motorların sırayla çalıştırılması).
2.2. Katmanlı Mimari Örneği
scss
Kodu kopyala
 ┌───────────────────────┐
 │      React (UI)       │
 │  (Kullanıcı Arayüzü)  │
 └─────────┬─────────────┘
           │ REST / WebSocket
 ┌─────────┴─────────────┐
 │  Node.js + Express    │
 │ (API ve İş Mantığı)   │
 └─────────┬─────────────┘
           │ MongoDB Driver / ORM
 ┌─────────┴─────────────┐
 │       MongoDB         │
 │ (Veri Tabanı Katmanı) │
 └───────────────────────┘
Bu yapıya ek olarak, satranç motorlarıyla iletişim ya Node.js child process veya Socket üzerinden sağlanarak motorların hamle üretmesi için gereken veriler gönderilir ve alınır.

3. Detaylı Bileşen ve Teknoloji Seçimleri
3.1. Frontend - React
React: Modern ve performanslı bir frontend framework’ü.
UI Kütüphanesi: TailwindCSS, Material-UI, Ant Design vb. (Modern ve minimal tasarım için TailwindCSS tercih edilebilir.)
State Management: React içinde standart Hooks veya Redux/Context API kullanımı.
Chessboard Görselleştirme: react-chessboard gibi hazır bir bileşen veya kendi özel satranç tahtası çizimi.
Gerçek Zamanlı İletişim:
Socket.IO veya WebSockets: Canlı hamlelerin ve istatistiklerin anlık güncellemesi için.
Hamleler geldiğinde tahtanın güncellenmesi ve istatistik panelinin yenilenmesi.
3.2. Backend - Node.js + Express
Express: REST API endpoint’lerini yönetmek ve Socket.IO entegrasyonunu sağlamak için.

İş Mantığı (Services/Controllers):

Bot Entegrasyon Servisi: Seçilen botların (Stockfish, Leela Chess Zero, Komodo vb.) başlatılması/durdurulması, komut gönderilmesi, cevap alınması.
Oyun Yönetim Servisi: İki bot arasında oyun başlatma, hamle sırası takibi, hamlelerin validasyonu ve bitiş koşullarının kontrolü.
İstatistik Servisi: Hamle süreleri, oyun sonucu, hamle sayısı gibi metriklerin toplanması ve veri tabanına yazılması.
API Uç Noktaları (Endpoints) (örnekler):

POST /api/game/start: Belirlenen iki bot arasında yeni bir oyun başlatır.
GET /api/game/:id: Oyun detaylarını döner (hamleler, süreler, skor vb.).
GET /api/bots: Entegre edilen tüm botların listesini döner.
GET /api/stats/leaderboard: Botların performans sıralaması (kazanma oranı, ELO benzeri metrik vb.).
Satranç Hamle Validasyonu:

chess.js veya benzeri bir kütüphane kullanarak hamlelerin geçerliliği denetlenebilir. (Örneğin, motorun döndürdüğü hamle satranç kurallarına uygun mu diye kontrol etmek için).
Alternatif olarak, direkt entegre edilen motorların validasyon mekanizmalarından da yararlanılabilir, ancak genelde chess.js gibi bir kütüphane, projeye şeffaflık ve geliştirme kolaylığı katar.
3.3. Veri Tabanı - MongoDB
MongoDB: Doküman tabanlı yapısıyla satranç hamlelerinin kaydedilmesi ve raporlama (istatistik) verilerinin tutulması için esnek bir çözüm sunar.

Veritabanı Şeması (örnek):

Games:
gameId, botA, botB, moves[], result, startTime, endTime, duration, statistics vb.
Bots:
name, engineVersion, eloRating (tahmini veya test sonuçlarından oluşturulmuş) vb.
Stats (opsiyonel olarak ayrı ya da Games dokümanına gömülü):
moveTimeDistribution, cpuUsage, memoryUsage (isteğe bağlı), winner, loser, vb.
ORM / ODM: Mongoose veya Prisma (MongoDB için destekli versiyonu) tercih edilebilir. (Mongoose genellikle Node.js ekosisteminde yaygın.)

4. Geliştirme Adımları
Aşağıdaki adımlar projeyi yönetirken bir rehber niteliğindedir. Her adım sonunda test ve doğrulama yapılması önerilir.

Proje Altyapısının Oluşturulması (Backend)

Node.js + Express yapılandırması.
Temel proje klasör yapısının oluşturulması.
MongoDB bağlantısının sağlanması.
Örnek bir health-check endpoint’i oluşturularak sistemin temel çalışırlığının doğrulanması.
Satranç Motorlarının ve Hamle Validasyonunun Entegrasyonu

Stockfish, Leela Chess Zero gibi motorlar için çalışma mantığının incelenmesi (CLI, UCI, API).
child_process veya uygun kütüphaneler ile motorlarla iletişim katmanının yazılması.
chess.js (veya benzerinin) eklenerek gelen hamlelerin doğruluğunun kontrolünün sağlanması.
Botlar Arası Oyun Mantığının Geliştirilmesi

İki farklı bot seçildiğinde, sırasıyla hamle ürettirecek bir döngü oluşturulması.
Her hamle üretimi sonrasında chess.js ile validasyon ve oyunun bitip bitmediği kontrolü.
Oyun bitiminde sonuçların (kazanan, hamle sayısı, süre vb.) veri tabanına yazılması.
API Katmanının Geliştirilmesi ve Dokümantasyonu

start game, stop game, get game status, list bots, leaderboard gibi uç noktaların oluşturulması.
Swagger veya benzeri bir araçla API dokümantasyonunun sağlanması.
Frontend (React) Geliştirmesi

Sayfalar / Bileşenler:
Anasayfa: Bot seçimi, oyun başlatma.
Oyun Ekranı: Satranç tahtası (canlı hamle gösterimi), istatistik paneli (hamle süresi, hamle sayısı, skor vb.).
Liderlik Tablosu: Botların sıralaması, istatistikler.
Oyun Geçmişi: Daha önce oynanan oyunların listesi, sonuçları ve hamle tekrar izleme (PGN veya benzeri).
Veri İletişimi:
REST API veya WebSocket (Socket.IO) üzerinden hamlelerin anlık aktarımı.
Kullanıcı arayüzünün anlık güncellenmesi.
Gerçek Zamanlı İletişim ve Canlı Takip

Socket.IO (veya WebSocket) katmanının eklenmesi.
Sunucu her yeni hamleyi ürettiğinde frontend’e anlık bildirim göndermesi.
Test Süreçleri

Birim Testleri: Özellikle hamle validasyonu, oyun yönetimi ve API uç noktaları için.
Entegrasyon Testleri: Gerçekten iki botun bir oyun boyunca sorunsuz oynayabildiğini teyit etmek.
Yük ve Performans Testleri: Aynı anda birden fazla oyun başlatıldığında sistemin davranışını izlemek (CPU, bellek kullanımı vb.).
Canlı Ortama Alma (Deployment) ve Performans Analizleri

Projenin Docker ya da benzeri bir konteyner yapısına alınması ve bir bulut ortamına (AWS, GCP, Azure vb.) dağıtılması.
Gerçek kullanıcıların (veya otomatik testlerin) projeyi kullanmasıyla elde edilen verilerin analiz edilmesi.
Gerekli optimizasyonların yapılması (ör. motorların paralel çalışması, caching stratejileri).
5. Ek Özellikler ve İyileştirmeler
Kullanıcı Girişi ve Rol Yönetimi

Projeyi açık erişimli yapmak yerine, belirli kullanıcıların sisteme giriş yaparak oyun başlatması, sonuçlara erişmesi.
Farklı yetki seviyeleri (ör. admin, normal kullanıcı).
Gelişmiş İstatistik Analizi

Botların farklı pozisyonlara yaklaşım süreleri, açılış repertuarları, örüntü tanıma gibi detaylı istatistikler.
Farklı motorların birbirlerine karşı ELO benzeri puanlamalarının otomatik hesaplanması.
Farklı Modlar

Belirli bir açılıştan başlama (ör. Sicilian Defense), motorların bu açılışa karşı tepkilerinin incelenmesi.
Zamana dayalı modlar (ör. her motorun hamle üretmek için 2 saniyesi olsun gibi).
Oyun Kayıt Formatları (PGN, FEN)

Her maçın PGN formatında indirilmesine izin vererek, harici satranç uygulamalarında analizin mümkün hale getirilmesi.
Farklı konumlardan başlama (FEN formatında belirli bir konum vererek).
Özelleştirilebilir Parametreler

Botların düşünme süresini, derinlik parametrelerini, concurrency seçeneklerini kullanıcı arayüzünden ayarlanabilir hale getirmek.
6. Örnek Proje Klasör Yapısı
scss
Kodu kopyala
my-chess-bot-project/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ services/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ utils/
│  │  └─ app.js
│  ├─ tests/
│  ├─ package.json
│  └─ ...
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ services/
│  │  ├─ App.js
│  │  └─ index.js
│  ├─ package.json
│  └─ ...
├─ docker-compose.yml (opsiyonel)
├─ README.md
└─ ...
backend/src/controllers: API endpoint’lerini tanımlayan dosyalar.
backend/src/services: Uygulama mantığı, bot entegrasyonu, oyun yönetimi vb.
backend/src/models: Mongoose şemaları veya veritabanı modelleri.
frontend/src/components: UI bileşenleri (satranç tahtası, butonlar, paneller).
frontend/src/pages: Sayfa düzeyinde bileşenler (Anasayfa, Oyun Ekranı, Liderlik Tablosu vb.).
7. Sonuç
Bu proje taslağı; modern bir web arayüzü üzerinden satranç yapay zeka motorlarını birbirine karşı oynatma fikrini hayata geçirmek için gereken temel yol haritasını ve teknolojileri özetlemektedir. Projede dikkat edilmesi gereken temel noktalar:

Entegrasyon Kolaylığı: Bot entegrasyonu olabildiğince modüler tutulmalı.
Ölçeklenebilirlik: Birden çok oyunun paralel olarak yürütülebileceği ve ölçeklenebilecek bir mimari tasarım.
Gerçek Zamanlılık: Kullanıcıların canlı izleyebilmesi için düşük gecikmeli bir iletişim altyapısı.
İstatistik ve Depolama: Oyun sonuçlarının ileride yapılacak performans analizlerine elverişli şekilde saklanması.