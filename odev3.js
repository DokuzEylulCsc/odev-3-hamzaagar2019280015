//Node.js üstündeki dosya işlemlerini sağlayan kütüphaneyi dahil ediyoruz
var dosyaOkuYaz = require("fs");
//EOL kontrolünü işletim sistemine göre kontrol etmek için
//Node.js'in os kütüphanesini kullanıyoruz
var isletimSistemiKutuphanesi = require('os');

//Eğer yuvarlama true değer alırsa ortalama değerini en yakın tamsayıya yuvarlar
var yuvarlama = false

dosyaOkuYaz.readFile("input.txt", function (hata, dosyadanGelenVeri) {
    if (hata) {
        return console.log("Dosya okunurken hata oluştu!");
    }

    var siralanmisDizi = dosyaOku(dosyadanGelenVeri);

    dosyaYaz(siralanmisDizi);

})

//Kararı değerlendirip true ise yuvarlayan false ise aynen döndüren fonksiyon
function yuvarlamaFonksiyonu(karar, deger) {
    if (karar === true) {
        return Math.round(deger)
    } else {
        return deger
    }
}

function dosyaOku(dosyadanGelenVeri) {
    //Dosyalan gelen veriyi String'e çevirip \n \r gibi ayraçları kontrol eden kütüphane yardımıyla parçalıyoruz
    var dizi = dosyadanGelenVeri.toString().split(isletimSistemiKutuphanesi.EOL);
    //Oluşan yeni dizimizin verilerini , ile parçalıyoruz
    for (i = 0; i < dizi.length; i++) {
        dizi[i] = dizi[i].toString().split(",");
    }

    var siralanmisDizi = [];
    //cevapKontrolFonksiyonu() ile cevapları cevap anahtarıyla karşılaştırıp puanları alıyoruz
    //Fonksiyon içerisinde sıralanmış halde geliyor
    siralanmisDizi = cevapKontrolFonksiyonu(dizi);
    return siralanmisDizi;
}

function dosyaYaz(siralanmisDizi) {
    //Dosyaya yazılacak String'i oluşturuyoruz
    var yeniDosyayaYazilacakVeri = "";
    //For döngüsüyle String'e öğrenci numarası ve puanı yazdırıyoruz ve satır atlatıyoruz
    for (i = 0; i < siralanmisDizi.length; i++) {
        yeniDosyayaYazilacakVeri += siralanmisDizi[i]["ogrNO"] + "," + siralanmisDizi[i]["puan"] + "\n";
    }
    //En yüksek puanı ekliyoruz
    yeniDosyayaYazilacakVeri += siralanmisDizi[0]["puan"] + ",";
    //En düşük puanı ekliyoruz
    yeniDosyayaYazilacakVeri += siralanmisDizi[siralanmisDizi.length - 1]["puan"] + ",";
    //ortalamaHesapla() fonksiyonu ile ortalamayı veriyoruz
    yeniDosyayaYazilacakVeri += yuvarlamaFonksiyonu(yuvarlama, ortalamaHesapla(siralanmisDizi)) + ",";
    //medyaniBul() fonksiyonu ile medyanı veriyoruz
    yeniDosyayaYazilacakVeri += medyaniBul(siralanmisDizi) + ",";
    //Dizinin en büyük teriminden en küçük terimini çıkartıp açıklığı veriyoruz
    yeniDosyayaYazilacakVeri += (siralanmisDizi[0]["puan"] - siralanmisDizi[siralanmisDizi.length - 1]["puan"]);
    //Oluşturduğumuz String'i dosyaya yazdırıyoruz
    dosyaOkuYaz.writeFile('output.txt', yeniDosyayaYazilacakVeri, function (hata) {
        if (hata) {
            return console.error("Hata oluştu: " + hata);
        }
    });
}

function cevapKontrolFonksiyonu(cevaplar) {
    //Eğer cevap anahtarındaki cevap sayısı soru sayısına eşit mi diye kontrol ediyoruz
    if (cevaplar[0] == cevaplar[1].length) {
        //Boş bir dizi oluşturup öğrenci numaralarıyla ve puan indisi 0 olacak şekilde dolduruyoruz
        netHesaplamaDizisi = [];
        for (i = 2; i < cevaplar.length; i++) {
            var ogrNO = cevaplar[i][0];
            var puan = 0;
            netHesaplamaDizisi.push({
                ogrNO,
                puan
            });
        }
        //Eğer satır sayısı 2'den büyükse öğrenci girişi yapılmış demektir. Buna göre işlem yapıyoruz
        if (cevaplar.length > 2) {
            for (i = 2; i < cevaplar.length; i++) {
                for (j = 1; j <= 10; j++) {
                    //Doğruysa +4 ver
                    if (cevaplar[i][j] === cevaplar[1][j - 1]) {
                        netHesaplamaDizisi[i - 2]["puan"] += 4;
                    }

                    //Boşsa hiçbir şey yapma
                    else if (cevaplar[i][j] === "") {}
                    //Yanlışsa -1 ver
                    else {
                        netHesaplamaDizisi[i - 2]["puan"] -= 1;
                    }
                }
            }
        } else {
            console.log("Cevap anahtarı girilen öğrenci yok!");
        }
        //Netleri hesaplanan diziyi puana göre sıralıyoruz
        var siralanmisDizi = kabarcikSiralamaFonksiyonu(netHesaplamaDizisi)
        for (i = 0; i < siralanmisDizi.length; i++) {
            //Son satır boş olduğunda -10 net oluşuyor tamamını yanlış hesaplıyor bunu engellemek için
            //dizimizin uzunluğunu bir azaltarak o indisin silinmesini sağlıyoruz
            if (siralanmisDizi[i]["puan"] == -10) {
                siralanmisDizi.length -= 1;
            }
        }
        return siralanmisDizi;
    } else {
        console.log("Soru sayısı ve cevap anahtarındaki cevap sayısı eşit değil!\n");
    }
}

function kabarcikSiralamaFonksiyonu(dizi) {
    var yeniDizi = dizi;
    var n = yeniDizi.length;
    for (i = 0; i < n - 1; i++) {
        for (j = 0; j < n - i - 1; j++)
            //Dizimizdeki öğrencilerin puan indisine göre sıralanmasını sağlıyoruz
            if (yeniDizi[j]["puan"] < yeniDizi[j + 1]["puan"]) {
                var temp = yeniDizi[j];
                yeniDizi[j] = yeniDizi[j + 1];
                yeniDizi[j + 1] = temp;
            }
    }
    return yeniDizi;
}


function ortalamaHesapla(dizi) {
    //Toplam diye bir değişken oluşturup bu değişkene dizideki
    //elemanların puan indisindeki değeri ekliyoruz daha sonra da
    //dizi uzunluğuna toplam değişkenini bölüp ortalamayı döndürüyoruz
    var toplam = 0;
    for (i = 0; i < dizi.length; i++) {
        toplam += dizi[i]["puan"];
    }

    var ortalama = toplam / (dizi.length);
    return ortalama;
}

function medyaniBul(dizi) {
    //Dizi uzunluğunu ikiye bölüyoruz çıkan sonuç tamsayı ise
    //dizi uzunluğu çifttir diyoruz ve değerin bir eksiğindeki
    //indisle ortalamasını alıp sonucu medyan olarak dönüdüyoruz
    //dizi uzunluğu tek ise uzunluğa bir ekleyip ikiye bölerek orta değerin yerini buluyoruz.
    //Dizinin uzunluğunun çift olup olmadığı mod ile de kontrol edilebilir. 

    var ortanca = dizi.length / 2
    var medyan = 0;
    if (Number.isInteger(ortanca)) {

        medyan = (dizi[ortanca - 1]["puan"] + dizi[ortanca]["puan"]) / 2

    } else {
        var ortaDeger = (dizi.length + 1) / 2 - 1
        medyan = dizi[ortaDeger]["puan"]
    }
    return medyan
}