import { db } from "./firebase";
import firebase from "firebase";

export const doCreateUser = ( id, username, email, role ) => {
	db.ref(`users/${id}`).update({
		username,
		email,
		role,
	});
	db.ref(`pasiens/${id}/profil`).update({
		username,
		email,
		role,
	});
	db.ref(`pasiens/${id}`).update({
		flagActivity: "userIdle",
		pasienRekamMedik: 1,
		dokterRekamMedik: 1,
		statusPasien: "Umum",
	});
};

export const doSimpanDiagnosaPasien = ( id, tanggalPeriksa, hasilDiagnosa ) => {
	db.ref(`pasiens/${id}/rekamMedik/${tanggalPeriksa}`).update({
		hasilDiagnosa,
	});
	db.ref(`pasiens/${id}`).update({
		flagActivity : "hasilDiagnosaDone",
	});
};

export const doSimpanObatPasien = ( id, tanggalPeriksa, hasilObat ) => {
	db.ref(`pasiens/${id}/rekamMedik/${tanggalPeriksa}`).update({
		hasilObat,
	});
	db.ref(`pasiens/${id}`).update({
		flagActivity : "hasilObatDone",
	});
};

export const doSimpanDaftarTunggu = ( uid ) => {
	const getter = db.ref(`pasiens/${uid}`).update({
		flagActivity : "antriPoliklinik",
	});
	return getter;
};

export const doUpdateStatusBillingPasien = ( uid ) => {
	const getter = db.ref(`pasiens/${uid}`).update({
		flagActivity : "userIdle",
	});
	return getter;
};

export const doUpdateStatusApotekPasien = ( uid ) => {
	const getter = db.ref(`pasiens/${uid}`).update({
		flagActivity : "ambilObatDone",
	});
	return getter;
};

export const doUpdateDokterPoli1 = ( dokterName ) => {
	const getter = db.ref(`poliklinik/poli1`).update({
		dokter : dokterName,
		poli: "Poli1",
	});
	return getter;
};

export const doUpdateDokterPoli2 = ( dokterName ) => {
	const getter = db.ref(`poliklinik/poli2`).update({
		dokter : dokterName,
		poli: "Poli2",
	});
	return getter;
};

export const doPasienDaftarAntrian = ( uid, uName, nomorAntrian, isDokterPeriksa, isTanggalBooking, isStatusPasien ) => {
	db.ref(`daftarTunggu/${uid}`).update({
		namaUser: uName,
		statusPasien: isStatusPasien,
		nomorAntrianPasien: nomorAntrian,
		dokterPeriksa: isDokterPeriksa,
		tanggalBooking: isTanggalBooking,
		timeStamp: firebase.database.ServerValue.TIMESTAMP,
	});
	db.ref(`daftarTunggu`).update({
		nomorAntrian: nomorAntrian,
	});
	db.ref(`pasiens/${uid}`).update({
		flagActivity : "antriPoliklinik",
	});
};

export const doApotekBarangMasukxxInput = ( namaABM, jumlahABM, hargaBeliABM, hargaJualABM, satuanABM, jenisABM ) => {
	const id = db.ref(`apotekBarangMasuk`).push();
	const key = id.key;
	db.ref(`apotekBarangMasuk/${key}`).update ({
		idABM: key,
		namaABM: namaABM,
		jumlahABM: jumlahABM,
		hargaBeliABM: hargaBeliABM,
		hargaJualABM: hargaJualABM,
		satuanABM: satuanABM,
		jenisABM: jenisABM,
		timestamp: firebase.database.ServerValue.TIMESTAMP,
	});
};

export const doApotekStokxxInput = ( namaAS, jumlahAS, hargaBeliAS, hargaJualAS, satuanAS, jenisAS ) => {
	const aid = db.ref(`apotekStokBarang`).push();
	const akey = aid.key;
	db.ref(`apotekStokBarang/${akey}`).update ({
		idAS: akey,
		namaAS: namaAS,
		jumlahAS: jumlahAS,
		hargaBeliAS: hargaBeliAS,
		hargaJualAS: hargaJualAS,
		satuanAS: satuanAS,
		jenisAS: jenisAS,
	});
};

export const doApotekStokxxUpdateStok = ( idAS, jumlahAS ) => {
	db.ref(`apotekStokBarang/${idAS}`).update ({
		idAS: idAS,
		jumlahAS: jumlahAS,
	});
};

export const doInputConsDiag = ( namaDiag, hargaDiag ) => {
	const aid = db.ref(`constant`).push();
	const akey = aid.key;
	db.ref(`constant/${akey}`).update ({
		idDiag: akey,
		namaDiag: namaDiag,
		hargaDiag: hargaDiag,
		flag: "diagnosa",
	});
};

export const doUpdateStatusPasien = ( uid, p ) => {
	const getter = db.ref(`pasiens/${uid}`).update({
		statusPasien : p,
	});
	return getter;
};

export const doUpdatePolidaftarTunggu = ( p, q ) => {
	db.ref(`daftarTunggu/${p}`).update ({
		poli: q,
	});
};

export const doUpdateFlagActivity = ( uid, p ) => {
	const getter = db.ref(`pasiens/${uid}`).update({
		flagActivity : p,
	});
	return getter;
};

export const doUpdatePercentageOfShare = ( p, q, r, s ) => {
	const getter = db.ref(`management/percentageOfShare`).update({
		jasaMedik : p,
		sarana: q,
		belanjaModal: r,
		saham: s,
	});
	return getter;
};

export const doInputTransaksiNomorFakturKeluar = ( p ) => {
	// const aid = db.ref(`transaksi`).push();
	// const akey = aid.key;
	db.ref(`transaksi`).update ({
		transaksiNomorFakturKeluar: parseInt(p, 10),
	});
};

// ================= Get Data

export const onceGetUsers = () => {
	db.ref("users").once("value");
};

export const GetAllPasien = ( param1 ) => {
	const getter = db.ref(`pasiens`).orderByChild("role").equalTo(`${param1}`).once("value");
	return getter;
};

export const GetAllPasienStatusTungguNOK = () => {
	const getter = db.ref(`pasiens`).orderByChild("flagActivity").equalTo("userIdle").once("value");
	return getter;
};

export const GetAllPasienStatusBillingNOK = () => {
	const getter = db.ref(`pasiens`).orderByChild("flagActivity").equalTo("ambilObatDone").once("value");
	return getter;
};

export const GetAllPasienStatusApotekNOK = () => {
	const getter = db.ref(`pasiens`).orderByChild("flagActivity").equalTo("hasilObatDone").once("value");
	return getter;
};

export const GetLihatDaftarTunggu = () => {
	const getter = db.ref("pasiens").orderByChild("flagActivity").equalTo("antriPoliklinik").once("value");
	return getter;
};

export const GetLihatDaftarTungguByToday = () => {
	const getter = db.ref("pasiens").orderByChild("flagActivity").equalTo("antriPoliklinikByToday").once("value");
	return getter;
};

export const GetRekamMedikPasien = (uid) => {
	const getter = db.ref(`pasiens/${uid}`).once("value");
	return getter;
};

export const GetRekamMedikPasienX2 = (uid) => {
	const getter = db.ref(`rekamMedikDb`).orderByChild("pasienId").equalTo(`${uid}`).once("value");
	return getter;
};

export const GetRekamMedikPasienX3 = (uid, q) => {
	// console.log(q, `${uid}-${q}`);
	const getter = db.ref(`rekamMedikDb`).orderByChild("pasienNoRekamMedik").equalTo(`${uid}` + `-` + `${q}`).once("value");
	return getter;
};

export const GetRekamMedikObatPasienX3 = (uid, q) => {
	// console.log(q, `${uid}-${q}`);
	const getter = db.ref(`rekamMedikDbObat`).orderByChild("pasienNoRekamMedik").equalTo(`${uid}` + `-` + `${q}`).once("value");
	return getter;
};

export const GetRekamMedikPasienX4 = (uid) => {
	const getter = db.ref(`transaksiKeluar`).orderByChild("pasienId").equalTo(`${uid}`).once("value");
	return getter;
};

// export const GetRekamMedikObatPasienX4 = (uid, q) => {
// 	// console.log(q, `${uid}-${q}`);
// 	const getter = db.ref(`transaksiKeluar`).orderByChild("pasienId").equalTo(`${uid}` + `-` + `${q}`).once("value");
// 	return getter;
// };

export const GetSingleUsers = (uid) => {
	const resUser = db.ref(`users/${uid}`).once("value");
	return resUser;
};

export const getNumberLastAntrian = () => {
	const resUser = db.ref(`daftarTunggu/nomorAntrian`).once("value");
	return resUser;
};

export const getNomorAntrianPasien = ( uid ) => {
	const resUser = db.ref(`daftarTunggu/${uid}`).once("value");
	return resUser;
};

export const getIdAS = ( p ) => {
	const x = db.ref(`apotekStokBarang`).orderByChild("namaAS").equalTo(`${p}`).once("value");
	return x;
};

export const getApotekStok = () => {
	const x = db.ref(`apotekStokBarang`).once("value");
	return x;
};

export const getPoli = () => {
	const x = db.ref(`poliklinik`).once("value");
	return x;
};

export const getPolixxByDokter = ( p ) => {
	const x = db.ref(`poliklinik`).orderByChild("dokter").equalTo(`${p}`).once("value");
	return x;
};

export const getConstDiag = () => {
	const x = db.ref(`constant`).orderByChild("flag").equalTo("diagnosa").once("value");
	return x;
};

export const getPasienInfoFromFb = (uid) => {
	const resUser = db.ref(`pasiens/${uid}`).once("value");
	return resUser;
};

export const getListAllDokter = ( ) => {
	const x = db.ref(`users`).orderByChild("role").equalTo("dokter").once("value");
	return x;
};

export const getDaftarTungguxxByTanggal = ( p ) => {
	const x = db.ref(`daftarTunggu`).orderByChild("tanggalBooking").equalTo(`${p}`).once("value");
	return x;
};
