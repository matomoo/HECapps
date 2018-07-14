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

export const doPasienDaftarAntrian = ( uid, uName, nomorAntrian ) => {
	db.ref(`daftarTunggu/${uid}`).update({
		namaUser: uName,
		nomorAntrianPasien: nomorAntrian,
	});
	db.ref(`daftarTunggu`).update({
		nomorAntrian: nomorAntrian,
	});
	db.ref(`pasiens/${uid}`).update({
		flagActivity : "antriPoliklinik",
	});

};

export const doApotekBarangMasukxxInput = ( namaABM, jumlahABM, hargaBeliABM, satuanABM, jenisABM ) => {
	const id = db.ref(`apotekBarangMasuk`).push();
	const key = id.key;
	db.ref(`apotekBarangMasuk/${key}`).update ({
		idABM: key,
		namaABM: namaABM,
		jumlahABM: jumlahABM,
		hargaBeliABM: hargaBeliABM,
		satuanABM: satuanABM,
		jenisABM: jenisABM,
		timestamp: firebase.database.ServerValue.TIMESTAMP,
	});
};

export const doApotekStokxxInput = ( namaAS, jumlahAS, hargaBeliAS, satuanAS, jenisAS ) => {
	const aid = db.ref(`apotekStokBarang`).push();
	const akey = aid.key;
	db.ref(`apotekStokBarang/${akey}`).update ({
		idAS: akey,
		namaAS: namaAS,
		jumlahAS: jumlahAS,
		hargaBeliAS: hargaBeliAS,
		hargaJualAS: 0,
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

export const GetRekamMedikPasien = (uid) => {
	const getter = db.ref(`pasiens/${uid}`).once("value");
	return getter;
};

export const GetRekamMedikPasienX2 = (uid) => {
	const getter = db.ref(`rekamMedik`).orderByChild("pasienId").equalTo(`${uid}`).once("value");
	return getter;
};

export const GetSingleUsers = (uid) => {
	const resUser = db.ref(`users/${uid}`).once("value");
	return resUser;
};

export const getNumberLastAntrian = () => {
	const resUser = db.ref(`daftarTunggu/nomorAntrian`).once("value");
	return resUser;
};

export const getNomorAntrianPasien = ( uid ) => {
	const resUser = db.ref(`daftarTunggu/${uid}/nomorAntrianPasien`).once("value");
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
