<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');
require($dir_www . '/pvd/comun/recursos/dbf/api_conversion.php');
require($dir_www . '/pvd/comun/recursos/dbf/XBaseColumn.php');
require($dir_www . '/pvd/comun/recursos/dbf/XBaseRecord.php');
require($dir_www . '/pvd/comun/recursos/dbf/XBaseTable.php');
require($dir_www . '/pvd/comun/recursos/dbf/XBaseWritableTable.php');


class CuentabancariaController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function cuentabancariaAction()
    {
        $this->view->dirScriptsCmpReccomplejas = $this->integrator->reccomplejas->obtenerScriptsReccomplejas();
        //$this->view->jsayuda    = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * Accion utilizada para listar los datos de las personas que no tienen cuentas bancarias.
     */
    public function getDataToExportAction()
    {
        //listado de id de las personas sin cuenta bancaria
        $idpersons = json_decode(stripslashes($this->_getParam('personas')));

        //  $dataPersons = $this->pIntegrator->persona->GetDataPersonBankAccount($idpersons);

        $sqlEstructurar = "select *,d.direccion as direc , p.idpersona as identificador from mod_persona.dat_persona p
                            inner join mod_persona.dat_docidentidad de on(de.idpersona = p.idpersona)
                            inner join mod_persona.nom_tipodocidentidad tde on(tde.idtipodocidentidad =de.idtipodocidentidad)
                            left join mod_persona.dat_direccion d  on(d.idpersona = p.idpersona)
                            where p.idpersona in (" . implode(",", $idpersons) . ");";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $dataPersons = $conn->fetchAll($sqlEstructurar);
        $persindireccion = array();
        foreach ($dataPersons as $key => $person) {
            $dataPersons[$key]['idpersona'] = $person['identificador'];
            $dataPersons[$key]['numid'] = $person['numero'];
            $this->conformarDireccion($dataPersons, $key);
            if ($person[idtipodocidentidad] == 1) {
                $dataPersons[$key]['cod_tipid'] = 'CI';
            } else
                if ($person[idtipodocidentidad] == 2) {
                    $dataPersons[$key]['cod_tipid'] = 'CM';
                }
            $dataPersons[$key]['cod_paexid'] = 247;

            $dataPersons[$key]['nombrecompleto'] = $person['nombre'] . ' ' . $person['snombre'];
            $dataPersons[$key]['nombreyapellidos'] = $person['nombre'] . ' ' . $person['snombre'] . ' ' . $person['papel'] . ' ' . $person['sapel'];
            if (empty($person['direccion'])) {
                $persindireccion[] = $person['nombre'] . (!empty($person['snombre']) ? ' ' . $person['snombre'] . ' ' : ' ') . $person['papel'] . ' ' . $person['sapel'];
            }
            $dir1 = substr($person['direccion'], 0, 35);
            $dir2 = substr($person['direccion'], 35, 70);
            $dir3 = substr($person['direccion'], 70);

            $dataPersons[$key]['dir_perso1'] = $dir1;
            $dataPersons[$key]['dir_perso2'] = $dir2;
            $dataPersons[$key]['dir_perso3'] = $dir3;

            $dataPersons[$key]['est_mlc'] = '';
            $dataPersons[$key]['nom_mnac'] = '.T';

            if ($dataPersons[$key]['beneficiario'] != "") {
                $beneficiario = explode(',', $dataPersons[$key]['beneficiario']);
                $cantb = count($beneficiario);

                $dataPersons[$key]['num_ideben'] = $beneficiario[0];
                $dataPersons[$key]['ap1_benef'] = $beneficiario[$cantb - 2];
                $dataPersons[$key]['ap2_benef'] = $beneficiario[$cantb - 1];
                $dataPersons[$key]['nombre_b'] = ($cantb == 4) ? ($beneficiario[1]) : ($beneficiario[1] . ' ' . $beneficiario[2]);
            } else {
                $dataPersons[$key]['num_ideben'] = "";
                $dataPersons[$key]['ap1_benef'] = "";
                $dataPersons[$key]['ap2_benef'] = "";
                $dataPersons[$key]['nombre_b'] = "";
            }

            $dataPersons[$key]['cta_mnac'] = '';
            $dataPersons[$key]['cta_mlc'] = '';
        }

        $_SESSION['dataDBF'] = $dataPersons;

        $r['datos'] = $dataPersons;
        $r['cantidad'] = count($dataPersons);
        $r['error'] = (!empty($persindireccion)) ? implode('; ', $persindireccion) : 'ok';
        echo(json_encode($r));
    }

    public function ExportDbfAction()
    {
        header('content-type:text/html; charset="UTF-8"');//header() antes de generar cualquier tipo de contenido
        $dataTodbf = json_decode(stripslashes($this->_getParam('datadbf')));
        $moneda = $this->_getParam('moneda');
        $s = new stdClass();
        $dataPersons = array();
        foreach ($dataTodbf as $kp => $vp) {
            $sqlEstructurar = "select *,d.direccion as direc,ntas.abreviatura as acreditacionsalario  from mod_persona.dat_persona p
                            inner join mod_persona.dat_docidentidad de on(de.idpersona = p.idpersona)
                            inner join mod_persona.nom_tipodocidentidad tde on(tde.idtipodocidentidad =de.idtipodocidentidad)
                            left join mod_persona.dat_direccion d  on(d.idpersona = p.idpersona)
                            left join mod_personaext.dat_cuentabancaria cb on (cb.idpersona =p.idpersona)
                            left join mod_personaext.nom_tipoacreditacionsalario ntas on(ntas.idtipoacreditacionsalario = cb.idtipoacreditacionsalario)
                            left join mod_datosmaestros.nom_moneda mn on(mn.idmoneda = cb.idmoneda)
                            where p.idpersona = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $dataPersons[$kp] = $conn->fetchAll($sqlEstructurar, array($vp));
        }

        $definiciones = array();
        array_push($definiciones, array("NUM_IDEPER", DBFFIELD_TYPE_CHAR, 15));//1
        array_push($definiciones, array("NOMBRE", DBFFIELD_TYPE_CHAR, 50));    //2
        array_push($definiciones, array("APELLIDO_1", DBFFIELD_TYPE_CHAR, 50));//3
        array_push($definiciones, array("APELLIDO_2", DBFFIELD_TYPE_CHAR, 50));//4
        array_push($definiciones, array("NOMB_APELL", DBFFIELD_TYPE_CHAR, 23));//5
        array_push($definiciones, array("DIR_PERSO1", DBFFIELD_TYPE_CHAR, 35));//6
        array_push($definiciones, array("DIR_PERSO2", DBFFIELD_TYPE_CHAR, 35));//7
        array_push($definiciones, array("DIR_PERSO3", DBFFIELD_TYPE_CHAR, 35));//8
        array_push($definiciones, array("NUM_IDEBEN", DBFFIELD_TYPE_CHAR, 15));//9
        array_push($definiciones, array("NOMBRE_B", DBFFIELD_TYPE_CHAR, 50));  //10
        array_push($definiciones, array("AP1_BENEF", DBFFIELD_TYPE_CHAR, 50)); //11
        array_push($definiciones, array("AP2_BENEF", DBFFIELD_TYPE_CHAR, 50)); //12
        array_push($definiciones, array("NOM_MNAC", DBFFIELD_TYPE_LOGICAL, 1));//13
        array_push($definiciones, array("EST_MLC", DBFFIELD_TYPE_LOGICAL, 1)); //14
        array_push($definiciones, array("CTA_MLC", DBFFIELD_TYPE_CHAR, 16));   //15
        array_push($definiciones, array("CTA_MNAC", DBFFIELD_TYPE_CHAR, 16));  //16
        array_push($definiciones, array("COD_PAEXID", DBFFIELD_TYPE_CHAR, 3)); //17
        array_push($definiciones, array("COD_TIPID", DBFFIELD_TYPE_CHAR, 2));  //18

        $dbase = XBaseWritableTable::create((($moneda == 1) ? "CUP.dbf" : "CUC.dbf"), $definiciones);
        $persindireccion = array();
        if (!$dbase) {
            $s->codigo = 'NOCREADBF';
        } else {
            foreach ($dataPersons as $k => $val) {
                if (empty($val[0]['direccion'])) {
                    $persindireccion[] = $val[0]['nombre'] . (!empty($val[0]['snombre']) ? ' ' . $val[0]['snombre']. ' ' : ' ') . $val[0]['papel'] . ' ' . $val[0]['sapel'];
                }
                $ci = $val[0]['numero'];
                $nombre = $val[0]['nombre'];
                $snombre = $val[0]['snombre'];
                $papel = $val[0]['papel'];
                $sapel = $val[0]['sapel'];
                $dir1 = mb_substr($val[0]['direccion'], 0, 35);
                $dir2 = mb_substr($val[0]['direccion'], 35, 70);
                $dir3 = mb_substr($val[0]['direccion'], 70);
                $rec = $dbase->appendRecord();
                $rec->setObjectByName("NUM_IDEPER", utf8_decode($ci));
                $rec->setObjectByName("NOMBRE", utf8_decode($nombre));
                $rec->setObjectByName("APELLIDO_1", utf8_decode($papel));
                $rec->setObjectByName("APELLIDO_2", utf8_decode($sapel));
                $rec->setObjectByName("NOMB_APELL", utf8_decode($nombre . (!empty($snombre) ? ' ' . $snombre : '') . ' ' . $papel . ' ' . $sapel));
                $rec->setObjectByName("DIR_PERSO1", utf8_decode($dir1));
                $rec->setObjectByName("DIR_PERSO2", utf8_decode($dir2));
                $rec->setObjectByName("DIR_PERSO3", utf8_decode($dir3));
                $rec->setObjectByName("NUM_IDEBEN", '');
                $rec->setObjectByName("NOMBRE_B", '');
                $rec->setObjectByName("AP1_BENEF", '');
                $rec->setObjectByName("AP2_BENEF", '');
                $rec->setObjectByName("NOM_MNAC", ($moneda == 1) ? 'T' : 'F');
                $rec->setObjectByName("EST_MLC", ($moneda == 2) ? 'T' : 'F');
                $rec->setObjectByName("CTA_MLC", '');
                $rec->setObjectByName("CTA_MNAC", '');
                $rec->setObjectByName("COD_PAEXID", '247');
                $rec->setObjectByName("COD_TIPID", 'CI');
                $dbase->writeRecord();
            }
            $dbase->close();
            $s->codigo = (!empty($persindireccion)) ? 'NODIRECCION' : 'OK';
            $s->error = implode('; ', $persindireccion);
            $s->url = "/pvd/nomina/" . (($moneda == 1) ? "CUP.dbf" : "CUC.dbf");
        }
        echo(json_encode($s));
    }

    public function conformarDireccion(&$array, $pos)
    {
        $direccion = '';
        if (is_numeric($array[$pos]['iddpa']) && is_numeric($array[$pos]['nocasa'])) {
            $obj = new ZendExt_Nomencladores_ADT ();
            if (!empty($array[$pos]['iddpa'])) {
                $idMunicp = $array[$pos]['iddpa'];
                $pWhere = '"nom_dpt".iddpt=' . "$idMunicp";
                $tmp = $obj->get("nom_dpt", 0, 0, $pWhere, 0);
                $mun = $tmp[0]['denominacion'];
                if (!empty($tmp[0]['idpadre'])) {
                    $idProv = $tmp[0]['idpadre'];
                    $pWhere = '"nom_dpt".iddpt=' . "$idProv";
                    $tmp = $obj->get("nom_dpt", 0, 0, $pWhere, 0);
                    $direccion = $tmp[0]['denominacion'] . '/' . $mun;
                } else {
                    $direccion = $mun;
                }
            }
            if (!empty($array[$pos]['idcalle'])) {
                $idcalle = $array[$pos]['idcalle'];
                $pWhere = '"nom_dpt".iddpt=' . "$idcalle";
                $tmp = $obj->get("nom_dpt", 0, 0, $pWhere, 0);
                $direccion .= ', ' . $tmp[0]['denominacion'];
            }
            if ($array[$pos]['noedificio']) {
                $direccion .= ', Edif. #' . $array[$pos]['noedificio'] . ' apto #' . $array[$pos]['nocasa'];
            } else {
                $direccion .= ', #' . $array[$pos]['nocasa'];
            }
            if (is_numeric($array[$pos]['entre1']) && is_numeric($array[$pos]['entre2'])) {
                $entre1 = $array[$pos]['entre1'];
                $pWhere = '"nom_dpt".iddpt=' . "$entre1";
                $tmp1 = $obj->get("nom_dpt", 0, 0, $pWhere, 0);

                $entre2 = $array[$pos]['entre2'];
                $pWhere = '"nom_dpt".iddpt=' . "$entre2";
                $tmp2 = $obj->get("nom_dpt", 0, 0, $pWhere, 0);

                $direccion .= ', e/ ' . $tmp1[0]['denominacion'] . ' y ' . $tmp2[0]['denominacion'];
            }
            $array[$pos]['direc'] = $direccion;
        } else {
            $array[$pos]['direc'] = "";
        }
    }
}

?>
