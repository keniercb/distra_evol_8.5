<?php

class ConfExportacionBanco extends BaseConfExportacionBanco
{
    public function obtenerListadoConfExportarDBFBanco()
    {
        return Doctrine_Query::create()
            ->select('*')
            ->from('ConfExportacionBancoEntidad c')
            ->orderBy('c.idconfexportacionbancoentidad ASC')
            ->fetchArray();
    }

    public function obtenerObjConfExportarDBFBancoXId($idconfig)
    {
        return Doctrine::getTable('ConfExportacionBancoEntidad')->find($idconfig);
    }

    public function obtenerTodasConfExpBanco($identidad, $idbanco)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT ceb.*, cebfe.idconfexportaciondbfbancoficheroentidad
                FROM  mod_nomina.conf_exportacionbanco ceb 
                inner join mod_nomina.conf_exportacionbancoficheroentidad cebfe on(cebfe.idconfexportaciondbfbancoficheroentidad = ceb.idconfexportaciondbfbancoficheroentidad) 
                WHERE cebfe.identidad = ? ORDER BY ceb.idbanco, ceb.orden,ceb.idconfexportaciondbfbanco";
        $result = $conn->fetchAll($sql, array($identidad));//print_r($sql);die;
        return $result;
    }

    public function obtenerConfExpBanco($identidad, $idbanco)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT ceb.*, cebfe.*
                FROM  mod_nomina.conf_exportacionbanco ceb 
                inner join mod_nomina.conf_exportacionbancoficheroentidad cebfe on(cebfe.idconfexportaciondbfbancoficheroentidad = ceb.idconfexportaciondbfbancoficheroentidad) 
                WHERE (ceb.identidad = $identidad AND ceb.idbanco = $idbanco) 
                OR (ceb.identidad = $identidad AND ceb.idbanco is NULL) ORDER BY ceb.orden,ceb.idconfexportaciondbfbanco";
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function obtenerFicheroConfExpBanco($identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT cebfe.fichero
                FROM  mod_nomina.conf_exportacionbancoficheroentidad cebfe
                WHERE cebfe.identidad = ?";
        $result = $conn->fetchOne($sql, array($identidad));
        return $result;
    }

    public function obtenerTipoFormatoConfExpBanco($identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT cebfe.tipoformato
                FROM  mod_nomina.conf_exportacionbancoficheroentidad cebfe
                WHERE cebfe.identidad = ?";
        $result = $conn->fetchOne($sql, array($identidad));
        return $result;
    }

    public function obtenerDenominacionBanco()
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT * FROM mod_datosmaestros.nom_banco";
        $bancos = $conn->fetchAll($sql);
        $result = array();
        foreach ($bancos as $banco) {
            $result[$banco['idbanco']] = $banco;
        }
        return $result;
    }

    public function findCampoByDenom($denom, $identidad)
    {
        try {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql = "SELECT COUNT(ceb.*)
                FROM  mod_nomina.conf_exportacionbanco ceb
                INNER JOIN mod_nomina.conf_exportacionbancoficheroentidad cebe ON (cebe.idconfexportaciondbfbancoficheroentidad = ceb.idconfexportaciondbfbancoficheroentidad )
                WHERE ceb.denomcampo ilike '%" . $denom . "%' and cebe.identidad = ?";
            $result = $conn->fetchOne($sql, array($identidad));
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function findCampoById($idconfexportaciondbfbanco)
    {
        try {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql = "SELECT * FROM  mod_nomina.conf_exportacionbanco WHERE idconfexportaciondbfbanco = ?";
            $result = $conn->fetchAll($sql, array($idconfexportaciondbfbanco));
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function obtenerCentroPagoBPA($identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT ceb.denomcampo
            FROM  mod_nomina.conf_exportacionbanco ceb
            INNER JOIN mod_nomina.conf_exportacionbancoficheroentidad cebe ON (cebe.idconfexportaciondbfbancoficheroentidad = ceb.idconfexportaciondbfbancoficheroentidad )
            WHERE cebe.identidad = ? and ceb.tipocampo = 'cod_centro_pago_bpa'";
        $result = $conn->fetchOne($sql, array($identidad));
        return $result;
    }

    public function obtenerCodSucursalBPA($identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT ceb.denomcampo
            FROM  mod_nomina.conf_exportacionbanco ceb
            INNER JOIN mod_nomina.conf_exportacionbancoficheroentidad cebe ON (cebe.idconfexportaciondbfbancoficheroentidad = ceb.idconfexportaciondbfbancoficheroentidad )
            WHERE cebe.identidad = ? and ceb.tipocampo = 'cod_sucursal_bpa'";
        $result = $conn->fetchOne($sql, array($identidad));
        return $result;
    }

    public function obtenerCodBancoBPA($identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT ceb.denomcampo
            FROM  mod_nomina.conf_exportacionbanco ceb
            INNER JOIN mod_nomina.conf_exportacionbancoficheroentidad cebe ON (cebe.idconfexportaciondbfbancoficheroentidad = ceb.idconfexportaciondbfbancoficheroentidad )
            WHERE cebe.identidad = ? and ceb.tipocampo = 'cod_banco_bpa'";
        $result = $conn->fetchOne($sql, array($identidad));
        return $result;
    }

    public function findConfById($idconfexportaciondbfbanco)
    {
        return Doctrine::getTable('ConfExportacionBanco')->find($idconfexportaciondbfbanco);
    }

    public function adicionarConfExpBanco($denominacion, $identidad, $idbanco, $tipocampo, $tipodato, $tipofichero, $longitudvalor, $lugaresdecimales, $orden, $tipoadd, $tipoformato /*= 1*/)
    {
        if ($idbanco == null) {
            $idbanco = null;
        }
        $objentidad = new ConfExportacionBancoFicheroEntidad();
        $obj = new ConfExportacionBanco();
        $idconfexpbancfichentidad = $objentidad->findIdConfByIdentidad($identidad);
        if (empty($idconfexpbancfichentidad)) {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql = "INSERT INTO mod_nomina.conf_exportacionbancoficheroentidad(identidad, tipoformato)
                VALUES ({$identidad}, {$tipoformato}) returning idconfexportaciondbfbancoficheroentidad;";
            $r = $conn->fetchAll($sql);
            $idconfexpbancfichentidad = $r[0]['idconfexportaciondbfbancoficheroentidad'];
        }

        //Tipo de adicion
        if ($tipoadd != 1) {//Manual
            $existecampo = $this->findCampoByDenom($denominacion, $identidad);
            if ($existecampo == 0) {
                $obj->denomcampo = $denominacion;
                $obj->idconfexportaciondbfbancoficheroentidad = $idconfexpbancfichentidad;
                $obj->idbanco = $idbanco;
                $obj->tipocampo = $tipocampo;
                $obj->tipodato = $tipodato;
                $obj->tipofichero = $tipofichero;
                $obj->longitudvalor = $longitudvalor;
                $obj->lugaresdecimales = $lugaresdecimales;
                $obj->identidad = $identidad;                
                $obj->orden = $orden;
                $obj->tipoformato = $tipoformato;
                $obj->save();
                return 1;
            } else {
                return 2;
            }
        } else {//Automatica
            //print_r($idconfexpbancfichentidad);die;
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $conn->beginTransaction();
            // $sql = "DELETE FROM mod_nomina.conf_exportacionbanco WHERE idconfexportaciondbfbancoficheroentidad = ?;";
            // $conn->execute($sql, array($idconfexpbancfichentidad));  $datoscampo == null || $rcampos[0]['idbanco] != $datoscampo[0]['idbanco]

            $rcampos = $this->obtenerCamposBanco($idbanco);
            $datoscampo = $this->obtenerTodasConfExpBanco($identidad, $idbanco);
            if($datoscampo == null || $rcampos[0]['idbanco'] != $datoscampo[0]['idbanco']){
                foreach ($rcampos as $i => $campo) {                    
                        $orden = $i += 1;
                        $sql = "INSERT INTO mod_nomina.conf_exportacionbanco(
                                            idbanco, 
                                            tipocampo,
                                            denomcampo,
                                            tipodato, 
                                            longitudvalor, 
                                            tipofichero, 
                                            lugaresdecimales, 
                                            idconfexportaciondbfbancoficheroentidad, 
                                            orden,
                                            tipoformato,
                                            identidad)
                                VALUES (?,?,?,?,?,?,?,?,?,?,?);";
                        $conn->execute($sql, array(
                            $campo['idbanco'],
                            $campo['tipocampo'],
                            $campo['denominacion'],
                            $campo['tipodato'],
                            $campo['longitudvalor'],
                            $campo['tipofichero'],
                            $campo['lugaresdecimales'],
                            $idconfexpbancfichentidad,
                            $orden,
                            $tipoformato,
                            $identidad
                        ));
                }
                $conn->commit();
                return 1;
            } else {
                return 2;
            }
        }
    }

    public function modificarConfExpBanco($idconfexportaciondbfbanco, $denominacion, $idbanco, $tipocampo, $tipodato, $tipofichero, $longitudvalor, $lugaresdecimales, $orden)
    {
        try {
            $obj = $this->findConfById($idconfexportaciondbfbanco);
            $obj->denomcampo = $denominacion;
            $obj->idbanco = $idbanco;
            $obj->tipocampo = $tipocampo;
            $obj->tipodato = $tipodato;
            $obj->tipofichero = $tipofichero;
            $obj->longitudvalor = $longitudvalor;
            $obj->lugaresdecimales = $lugaresdecimales;
            $obj->orden = $orden;
            $obj->save();
            return 1;
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    public function obtenerCamposBanco($idbanco)
    {
        $objConfExportacionBanco = new ConfExportacionBanco();
        $bancos = array('BM', 'BANDEC', 'BPA');
        $abrevbanco = $bancos[$idbanco];
        $arrbancos = $objConfExportacionBanco->obtenerDenominacionBanco();
        $arrbancos = array_values($arrbancos);
        $r = array();
        $idbancoaut = -1;
        foreach ($arrbancos as $i => $banco) {
            if ($banco['abreviatura'] == $abrevbanco) {
                $idbancoaut = $banco['idbanco'];
                break;
            }
        }

        switch ($idbanco) {
            case '0': {
                $r = array(
                    [
                        'idbanco' => $idbancoaut,
                        'tipocampo' => "cod_tipid",
                        'denominacion' => "COD_TIPID",
                        'tipodato' => 0,
                        'longitudvalor' => 2,
                        'tipofichero' => 1,
                        'lugaresdecimales' => 0,
                        'orden' => 1
                    ], [
                        'idbanco' => $idbancoaut,
                        'tipocampo' => "cod_paexid",
                        'denominacion' => "COD_PAEXID",
                        'tipodato' => 0,
                        'longitudvalor' => 3,
                        'tipofichero' => 1,
                        'lugaresdecimales' => 0,
                        'orden' => 2
                    ], [
                        'idbanco' => $idbancoaut,
                        'tipocampo' => "num_ideper",
                        'denominacion' => "NUM_IDEPER",
                        'tipodato' => 0,
                        'longitudvalor' => 15,
                        'tipofichero' => 1,
                        'lugaresdecimales' => 0,
                        'orden' => 3
                    ], [
                        'idbanco' => $idbancoaut,
                        'tipocampo' => "cta_mnac",
                        'denominacion' => "CTA_MNAC",
                        'tipodato' => 0,
                        'longitudvalor' => 16,
                        'tipofichero' => 1,
                        'lugaresdecimales' => 0,
                        'orden' => 4
                    ], [
                        'idbanco' => $idbancoaut,
                        'tipocampo' => "cta_mlc",
                        'denominacion' => "CTA_MLC",
                        'tipodato' => 0,
                        'longitudvalor' => 16,
                        'tipofichero' => 1,
                        'lugaresdecimales' => 0,
                        'orden' => 5
                    ], [
                        'idbanco' => $idbancoaut,
                        'tipocampo' => "importe_n",
                        'denominacion' => "IMPORTE_N",
                        'tipodato' => 2,
                        'longitudvalor' => 16,
                        'tipofichero' => 1,
                        'lugaresdecimales' => 2,
                        'orden' => 6
                    ], [
                        'idbanco' => $idbancoaut,
                        'tipocampo' => "importe_d",
                        'denominacion' => "IMPORTE_D",
                        'tipodato' => 2,
                        'longitudvalor' => 16,
                        'tipofichero' => 1,
                        'lugaresdecimales' => 2,
                        'orden' => 7
                    ]);
                break;
            }
            case '1': {
                $r = array([
                    'idbanco' => $idbancoaut,
                    'tipocampo' => "num_ideper",
                    'denominacion' => "NUM_IDEPER",
                    'tipodato' => 0,
                    'longitudvalor' => 15,
                    'tipofichero' => 1,
                    'lugaresdecimales' => 0,
                    'orden' => 3
                ], [
                    'idbanco' => $idbancoaut,
                    'tipocampo' => "cta_mnac",
                    'denominacion' => "CTA_MNAC",
                    'tipodato' => 0,
                    'longitudvalor' => 16,
                    'tipofichero' => 1,
                    'lugaresdecimales' => 0,
                    'orden' => 4
                ], [
                    'idbanco' => $idbancoaut,
                    'tipocampo' => "importe_n",
                    'denominacion' => "IMPORTE_N",
                    'tipodato' => 2,
                    'longitudvalor' => 16,
                    'tipofichero' => 1,
                    'lugaresdecimales' => 2,
                    'orden' => 6
                ], [
                    'idbanco' => $idbancoaut,
                    'tipocampo' => "cta_mlc",
                    'denominacion' => "CTA_MLC",
                    'tipodato' => 0,
                    'longitudvalor' => 16,
                    'tipofichero' => 1,
                    'lugaresdecimales' => 0,
                    'orden' => 5
                ], [
                    'idbanco' => $idbancoaut,
                    'tipocampo' => "importe_d",
                    'denominacion' => "IMPORTE_D",
                    'tipodato' => 2,
                    'longitudvalor' => 16,
                    'tipofichero' => 1,
                    'lugaresdecimales' => 2,
                    'orden' => 7
                ]);
                break;
            }
            case '2': {
                $r = array([
                    'idbanco' => $idbancoaut,
                    'tipocampo' => "num_ideper",
                    'denominacion' => "NUM_IDEPER",
                    'tipodato' => 0,
                    'longitudvalor' => 15,
                    'tipofichero' => 1,
                    'lugaresdecimales' => 0,
                    'orden' => 3
                ], [
                    'idbanco' => $idbancoaut,
                    'tipocampo' => "cta_mnac",
                    'denominacion' => "CTA_MNAC",
                    'tipodato' => 0,
                    'longitudvalor' => 16,
                    'tipofichero' => 1,
                    'lugaresdecimales' => 0,
                    'orden' => 4
                ], [
                    'idbanco' => $idbancoaut,
                    'tipocampo' => "importe_n",
                    'denominacion' => "IMPORTE_N",
                    'tipodato' => 2,
                    'longitudvalor' => 16,
                    'tipofichero' => 1,
                    'lugaresdecimales' => 2,
                    'orden' => 6
                ], [
                    'idbanco' => $idbancoaut,
                    'tipocampo' => "cta_mlc",
                    'denominacion' => "CTA_MLC",
                    'tipodato' => 0,
                    'longitudvalor' => 16,
                    'tipofichero' => 1,
                    'lugaresdecimales' => 0,
                    'orden' => 5
                ], [
                    'idbanco' => $idbancoaut,
                    'tipocampo' => "importe_d",
                    'denominacion' => "IMPORTE_D",
                    'tipodato' => 2,
                    'longitudvalor' => 16,
                    'tipofichero' => 1,
                    'lugaresdecimales' => 2,
                    'orden' => 7
                ]);
                break;
            }
        }
        return $r;
    }

    public function eliminarConfExpBanco($identidad, $arridconfexportaciondbfbanco)
    {
        $objentidad = new ConfExportacionBancoFicheroEntidad();
        if (!empty($arridconfexportaciondbfbanco)) {
            $idconfexportaciondbfbanco = implode(',', $arridconfexportaciondbfbanco);
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql = "DELETE FROM mod_nomina.conf_exportacionbanco WHERE idconfexportaciondbfbanco IN ({$idconfexportaciondbfbanco});";
            $conn->execute($sql);

            $rconf = $this->obtenerTodasConfExpBanco($identidad, null);
            if (empty($rconf)) {
                $sql = "DELETE FROM mod_nomina.conf_exportacionbancoficheroentidad WHERE identidad = ?;";
                $conn->execute($sql, array($identidad));
            }
            return 1;
        }
        return 2;
    }

    public function obtenerOrdenDisponible($identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select MAX(ceb.orden) as orden
			from mod_nomina.conf_exportacionbanco ceb
			inner join mod_nomina.conf_exportacionbancoficheroentidad cebe on (cebe.idconfexportaciondbfbancoficheroentidad = ceb.idconfexportaciondbfbancoficheroentidad)
			where cebe.identidad = ?";
        $r = $conn->fetchAll($sql, array($identidad));
        $r[0]['orden'] = !empty($r) ? $r[0]['orden'] + 1 : 1;
        return $r[0];
    }
}
