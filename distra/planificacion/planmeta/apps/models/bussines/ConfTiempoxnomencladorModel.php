<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ConfTiempoxnomencladorModel
 *
 * @author abel
 */
class ConfTiempoxnomencladorModel {

    public function adicionarTiempos($ejercicio, $annoejerc) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT nom_datosnomenclador.iddatosnomenclador,
                        nom_datosnomenclador.uridatosnomenclador as uridatosnomenclador
                 FROM mod_planificacion.nom_datosnomenclador,
                      mod_planificacion.nom_tiponomenclador
                 WHERE nom_datosnomenclador.idtiponomenclador =
                   nom_tiponomenclador.idtiponomenclador AND
                       nom_tiponomenclador.uritiponomenclador LIKE 'mes'
                       AND nom_datosnomenclador.uridatosnomenclador <> '-'";
        $MESES = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if (isset($MESES[0])) {
            foreach ($MESES as $key => $value) {
                //$verificarExisteTiempoNom = $objConfTiempoNom->verificarExisteTiempoNom($value['iddatosnomenclador'], $ejercicio);
                //if (!isset($verificarExisteTiempoNom[0])) {
                $objConfTiempoNom = new ConfTiempoxnomenclador();
                $objConfTiempoNom->idejercicio = $ejercicio;
                $objConfTiempoNom->iddatosnomenclador = $value['iddatosnomenclador'];
                if ($value['uridatosnomenclador'] == 'enero') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-01-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-01-31';
                    $objConfTiempoNom->save();
                } else if ($value['uridatosnomenclador'] == 'febrero') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-02-01';
                    //si annoejerc es true Bisiesto
                    if (($annoejerc % 4 == 0 && $annoejerc % 100 != 0) || $annoejerc % 400 == 0) {
                        $objConfTiempoNom->fechafin = '' . $annoejerc . '-02-29';
                    } else {
                        $objConfTiempoNom->fechafin = '' . $annoejerc . '-02-28';
                    }
                    $objConfTiempoNom->save();
                } else if ($value['uridatosnomenclador'] == 'marzo') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-03-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-03-31';
                    $objConfTiempoNom->save();
                } else if ($value['uridatosnomenclador'] == 'abril') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-04-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-04-30';
                    $objConfTiempoNom->save();
                } else if ($value['uridatosnomenclador'] == 'mayo') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-05-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-05-31';
                    $objConfTiempoNom->save();
                } else if ($value['uridatosnomenclador'] == 'junio') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-06-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-06-30';
                    $objConfTiempoNom->save();
                } else if ($value['uridatosnomenclador'] == 'julio') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-07-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-07-31';
                    $objConfTiempoNom->save();
                } else if ($value['uridatosnomenclador'] == 'agosto') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-08-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-08-31';
                    $objConfTiempoNom->save();
                } else if ($value['uridatosnomenclador'] == 'septiembre') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-09-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-09-30';
                    $objConfTiempoNom->save();
                } else if ($value['uridatosnomenclador'] == 'octubre') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-10-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-10-31';
                    $objConfTiempoNom->save();
                } else if ($value['uridatosnomenclador'] == 'noviembre') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-11-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-11-30';
                    $objConfTiempoNom->save();
                } else if ($value['uridatosnomenclador'] == 'diciembre') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-12-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-12-31';
                    $objConfTiempoNom->save();
                }
                //}
            }
        }

//TRIMESTRES
        $query2 = "SELECT nom_datosnomenclador.iddatosnomenclador,
          nom_datosnomenclador.uridatosnomenclador as uridatosnomenclador
          FROM mod_planificacion.nom_datosnomenclador,
          mod_planificacion.nom_tiponomenclador
          WHERE nom_datosnomenclador.idtiponomenclador =
          nom_tiponomenclador.idtiponomenclador AND
          nom_tiponomenclador.uritiponomenclador LIKE 'trimestre'
          AND nom_datosnomenclador.uridatosnomenclador <> '-'";
        $TRIMESTRES = $con->execute($query2)->fetchAll(PDO::FETCH_ASSOC);
        if (isset($TRIMESTRES[0])) {
            foreach ($TRIMESTRES as $key => $value) {
                //$verificarExisteTiempoNom = $objConfTiempoNom->verificarExisteTiempoNom($value['iddatosnomenclador'], $ejercicio);
                //if (!isset($verificarExisteTiempoNom[0])) {
                $objConfTiempoNom = new ConfTiempoxnomenclador();
                $objConfTiempoNom->idejercicio = $ejercicio;
                $objConfTiempoNom->iddatosnomenclador = $value['iddatosnomenclador'];
                if ($value['uridatosnomenclador'] == 'itrimestre') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-01-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-03-31';
                    $objConfTiempoNom->save();
                } else if ($value['uridatosnomenclador'] == 'iitrimestre') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-04-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-06-30';
                    $objConfTiempoNom->save();
                } else if ($value['uridatosnomenclador'] == 'iiitrimestre') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-07-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-09-30';
                    $objConfTiempoNom->save();
                } else if ($value['uridatosnomenclador'] == 'ivtrimestre') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-10-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-12-31';
                    $objConfTiempoNom->save();
                }
                //}
            }
        }

//SEMESTRES
        $query3 = "SELECT nom_datosnomenclador.iddatosnomenclador,
          nom_datosnomenclador.uridatosnomenclador as uridatosnomenclador
          FROM mod_planificacion.nom_datosnomenclador,
          mod_planificacion.nom_tiponomenclador
          WHERE nom_datosnomenclador.idtiponomenclador =
          nom_tiponomenclador.idtiponomenclador AND
          nom_tiponomenclador.uritiponomenclador LIKE 'semestre'
          AND nom_datosnomenclador.uridatosnomenclador <> '-'";
        $SEMESTRES = $con->execute($query3)->fetchAll(PDO::FETCH_ASSOC);
        if (isset($SEMESTRES[0])) {
            foreach ($SEMESTRES as $key => $value) {
                //$verificarExisteTiempoNom = $objConfTiempoNom->verificarExisteTiempoNom($value['iddatosnomenclador'], $ejercicio);
                //if (!isset($verificarExisteTiempoNom[0])) {
                $objConfTiempoNom = new ConfTiempoxnomenclador();
                $objConfTiempoNom->idejercicio = $ejercicio;
                $objConfTiempoNom->iddatosnomenclador = $value['iddatosnomenclador'];
                if ($value['uridatosnomenclador'] == 'isemestre') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-01-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-06-30';
                    $objConfTiempoNom->save();
                } else if ($value['uridatosnomenclador'] == 'iisemestre') {
                    $objConfTiempoNom->fechainicio = '' . $annoejerc . '-07-01';
                    $objConfTiempoNom->fechafin = '' . $annoejerc . '-12-31';
                    $objConfTiempoNom->save();
                }
                //}
            }
        }
        return 1;
    }

    public function adicionarTiemposOLD($ejercicio, $annoejerc) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT nom_datosnomenclador.iddatosnomenclador,
                        nom_datosnomenclador.uridatosnomenclador as uridatosnomenclador
                 FROM mod_planificacion.nom_datosnomenclador,
                      mod_planificacion.nom_tiponomenclador
                 WHERE nom_datosnomenclador.idtiponomenclador =
                   nom_tiponomenclador.idtiponomenclador AND
                       nom_tiponomenclador.uritiponomenclador LIKE 'mes'
                       AND nom_datosnomenclador.uridatosnomenclador <> '-'";
        $MESES = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($MESES as $key => $value) {
            if ($value['uridatosnomenclador'] == 'enero') {
                $enero = new ConfTiempoxnomenclador();
                $enero->idejercicio = $ejercicio;
                $enero->iddatosnomenclador = $value['iddatosnomenclador'];
                $enero->fechainicio = '' . $annoejerc . '-01-01';
                $enero->fechafin = '' . $annoejerc . '-01-31';
                $enero->save();
            } elseif ($value['uridatosnomenclador'] == 'febrero') {
                $febrero = new ConfTiempoxnomenclador();
                $febrero->idejercicio = $ejercicio;
                $febrero->iddatosnomenclador = $value['iddatosnomenclador'];
                $febrero->fechainicio = '' . $annoejerc . '-02-01';
                //si annoejerc es true Bisiesto
                if (($annoejerc % 4 == 0 && $annoejerc % 100 != 0) || $annoejerc % 400 == 0) {
                    $febrero->fechafin = '' . $annoejerc . '-02-29';
                } else {
                    $febrero->fechafin = '' . $annoejerc . '-02-28';
                }
                $febrero->save();
            } else if ($value['uridatosnomenclador'] == 'marzo') {
                $marzo = new ConfTiempoxnomenclador();
                $marzo->idejercicio = $ejercicio;
                $marzo->iddatosnomenclador = $value['iddatosnomenclador'];
                $marzo->fechainicio = '' . $annoejerc . '-03-01';
                $marzo->fechafin = '' . $annoejerc . '-03-31';
                $marzo->save();
            } else if ($value['uridatosnomenclador'] == 'abril') {
                $abril = new ConfTiempoxnomenclador();
                $abril->idejercicio = $ejercicio;
                $abril->iddatosnomenclador = $value['iddatosnomenclador'];
                $abril->fechainicio = '' . $annoejerc . '-04-01';
                $abril->fechafin = '' . $annoejerc . '-04-30';
                $abril->save();
            } else if ($value['uridatosnomenclador'] == 'mayo') {
                $mayo = new ConfTiempoxnomenclador();
                $mayo->idejercicio = $ejercicio;
                $mayo->iddatosnomenclador = $value['iddatosnomenclador'];
                $mayo->fechainicio = '' . $annoejerc . '-05-01';
                $mayo->fechafin = '' . $annoejerc . '-05-31';
                $mayo->save();
            } else if ($value['uridatosnomenclador'] == 'junio') {
                $junio = new ConfTiempoxnomenclador();
                $junio->idejercicio = $ejercicio;
                $junio->iddatosnomenclador = $value['iddatosnomenclador'];
                $junio->fechainicio = '' . $annoejerc . '-06-01';
                $junio->fechafin = '' . $annoejerc . '-06-30';
                $junio->save();
            } else if ($value['uridatosnomenclador'] == 'julio') {
                $julio = new ConfTiempoxnomenclador();
                $julio->idejercicio = $ejercicio;
                $julio->iddatosnomenclador = $value['iddatosnomenclador'];
                $julio->fechainicio = '' . $annoejerc . '-07-01';
                $julio->fechafin = '' . $annoejerc . '-07-31';
                $julio->save();
            } else if ($value['uridatosnomenclador'] == 'agosto') {
                $agosto = new ConfTiempoxnomenclador();
                $agosto->idejercicio = $ejercicio;
                $agosto->iddatosnomenclador = $value['iddatosnomenclador'];
                $agosto->fechainicio = '' . $annoejerc . '-08-01';
                $agosto->fechafin = '' . $annoejerc . '-08-31';
                $agosto->save();
            } else if ($value['uridatosnomenclador'] == 'septiembre') {
                $septiembre = new ConfTiempoxnomenclador();
                $septiembre->idejercicio = $ejercicio;
                $septiembre->iddatosnomenclador = $value['iddatosnomenclador'];
                $septiembre->fechainicio = '' . $annoejerc . '-09-01';
                $septiembre->fechafin = '' . $annoejerc . '-09-30';
                $septiembre->save();
            } else if ($value['uridatosnomenclador'] == 'octubre') {
                $octubre = new ConfTiempoxnomenclador();
                $octubre->idejercicio = $ejercicio;
                $octubre->iddatosnomenclador = $value['iddatosnomenclador'];
                $octubre->fechainicio = '' . $annoejerc . '-10-01';
                $octubre->fechafin = '' . $annoejerc . '-10-31';
                $octubre->save();
            } else if ($value['uridatosnomenclador'] == 'noviembre') {
                $noviembre = new ConfTiempoxnomenclador();
                $noviembre->idejercicio = $ejercicio;
                $noviembre->iddatosnomenclador = $value['iddatosnomenclador'];
                $noviembre->fechainicio = '' . $annoejerc . '-11-01';
                $noviembre->fechafin = '' . $annoejerc . '-11-30';
                $noviembre->save();
            } else if ($value['uridatosnomenclador'] == 'diciembre') {
                $diciembre = new ConfTiempoxnomenclador();
                $diciembre->idejercicio = $ejercicio;
                $diciembre->iddatosnomenclador = $value['iddatosnomenclador'];
                $diciembre->fechainicio = '' . $annoejerc . '-12-01';
                $diciembre->fechafin = '' . $annoejerc . '-12-31';
                $diciembre->save();
            }
        }

//TRIMESTRES
        $query2 = "SELECT nom_datosnomenclador.iddatosnomenclador,
          nom_datosnomenclador.uridatosnomenclador as uridatosnomenclador
          FROM mod_planificacion.nom_datosnomenclador,
          mod_planificacion.nom_tiponomenclador
          WHERE nom_datosnomenclador.idtiponomenclador =
          nom_tiponomenclador.idtiponomenclador AND
          nom_tiponomenclador.uritiponomenclador LIKE 'trimestre'
          AND nom_datosnomenclador.uridatosnomenclador <> '-'";
        $TRIMESTRES = $con->execute($query2)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($TRIMESTRES as $value1) {
            if ($value1['uridatosnomenclador'] == 'itrimestre') {
                $Trimestre1 = new ConfTiempoxnomenclador();
                $Trimestre1->idejercicio = $ejercicio;
                $Trimestre1->iddatosnomenclador = $value1['iddatosnomenclador'];
                $Trimestre1->fechainicio = '' . $annoejerc . '-01-01';
                $Trimestre1->fechafin = '' . $annoejerc . '-03-31';
                $Trimestre1->save();
            } else if ($value1['uridatosnomenclador'] == 'iitrimestre') {
                $Trimestre2 = new ConfTiempoxnomenclador();
                $Trimestre2->idejercicio = $ejercicio;
                $Trimestre2->iddatosnomenclador = $value1['iddatosnomenclador'];
                $Trimestre2->fechainicio = '' . $annoejerc . '-04-01';
                $Trimestre2->fechafin = '' . $annoejerc . '-06-30';
                $Trimestre2->save();
            } else if ($value1['uridatosnomenclador'] == 'iiitrimestre') {
                $Trimestre3 = new ConfTiempoxnomenclador();
                $Trimestre3->idejercicio = $ejercicio;
                $Trimestre3->iddatosnomenclador = $value1['iddatosnomenclador'];
                $Trimestre3->fechainicio = '' . $annoejerc . '-07-01';
                $Trimestre3->fechafin = '' . $annoejerc . '-09-30';
                $Trimestre3->save();
            } else if ($value1['uridatosnomenclador'] == 'ivtrimestre') {
                $Trimestre4 = new ConfTiempoxnomenclador();
                $Trimestre4->idejercicio = $ejercicio;
                $Trimestre4->iddatosnomenclador = $value1['iddatosnomenclador'];
                $Trimestre4->fechainicio = '' . $annoejerc . '-10-01';
                $Trimestre4->fechafin = '' . $annoejerc . '-12-31';
                $Trimestre4->save();
            }
        }

//SEMESTRES
        $query3 = "SELECT nom_datosnomenclador.iddatosnomenclador,
          nom_datosnomenclador.uridatosnomenclador as uridatosnomenclador
          FROM mod_planificacion.nom_datosnomenclador,
          mod_planificacion.nom_tiponomenclador
          WHERE nom_datosnomenclador.idtiponomenclador =
          nom_tiponomenclador.idtiponomenclador AND
          nom_tiponomenclador.uritiponomenclador LIKE 'semestre'
          AND nom_datosnomenclador.uridatosnomenclador <> '-'";
        $SEMESTRES = $con->execute($query3)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($SEMESTRES as $value2) {
            if ($value2['uridatosnomenclador'] == 'isemestre') {
                $Semestre1 = new ConfTiempoxnomenclador();
                $Semestre1->idejercicio = $ejercicio;
                $Semestre1->iddatosnomenclador = $value2['iddatosnomenclador'];
                $Semestre1->fechainicio = '' . $annoejerc . '-01-01';
                $Semestre1->fechafin = '' . $annoejerc . '-06-30';
                $Semestre1->save();
            } else if ($value2['uridatosnomenclador'] == 'iisemestre') {
                $Semestre2 = new ConfTiempoxnomenclador();
                $Semestre2->idejercicio = $ejercicio;
                $Semestre2->iddatosnomenclador = $value2['iddatosnomenclador'];
                $Semestre2->fechainicio = '' . $annoejerc . '-07-01';
                $Semestre2->fechafin = '' . $annoejerc . '-12-31';
                $Semestre2->save();
            }
        }
        return 1;
    }

}
