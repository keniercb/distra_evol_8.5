<?php

class ConfPagosporresultado extends BaseConfPagosporresultado
{

    public function setUp()
    {

        $this->hasOne('NomTipoPago', array('local' => 'idtipopago', 'foreign' => 'idtipopago'));
        $this->hasMany('ConfPagosporresultadoarea', array('local' => 'idpagoporresultado', 'foreign' => 'idpagoporresultado'));
        $this->hasMany('ConfPagosporresultadoperiodopago', array('local' => 'idpagoporresultado', 'foreign' => 'idpagoporresultado'));
        parent:: setUp();
    }

    public function getPagoPorId($idpagoporresultado)
    {
        return Doctrine::getTable('ConfPagosporresultado')->find($idpagoporresultado);
    }

    public function getByid($idpagoporresultado)
    {
        return Doctrine::getTable('ConfPagosporresultado')->find($idpagoporresultado);
    }

    public static function obtenerConfpagosporresultadosXId($idpagoporresultado)
    {

        //Devolviendo el listado de tipos de pago en forma de arreglo.
        return Doctrine_Query::create()
            ->select('*')
            ->from('ConfPagosporresultado')
            ->where('idpagoporresultado = ?', array($idpagoporresultado))
            ->fetchArray();
    }

    public function devPagosPorResultadosPorEntidades($identidad, $tipo, $idpagoporresultado)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        if (!empty($idpagoporresultado))
            $where = ($idpagoporresultado != -1) ? "and cpr.idpagoporresultado = {$idpagoporresultado};" : ";";
        $sql = "select cpr.*,ntp.denominacion as dentipopago
                from mod_nomina.conf_pagosporresultado cpr
                inner join mod_nomina.nom_tipopago ntp on (ntp.idtipopago = cpr.idtipopago)
                where cpr.identidad = {$identidad} " . $where;
        $r = $conn->fetchAll($sql);
        return $r;
    }

    /*
     * Existe configuracion para el tipo de pago
     * */
    public function getByidtipopago($idtipopago, $idestrcutura)
    {
        return Doctrine_Query::create()->select('COUNT(tb.idpagoporresultado) AS cantidad')
            ->from('ConfPagosporresultado tb')
            ->where("tb.identidad = ? and tb.idtipopago in ($idtipopago) ", array($idestrcutura))
            ->fetchOne()
            ->cantidad;
    }

    public function eliminarAreasyPeriodosDelPago($idpagoresultado)
    {
        $sql = "delete from mod_nomina.conf_pagosporresultadoarea
            WHERE mod_nomina.conf_pagosporresultadoarea.idpagoporresultado=$idpagoresultado;
           ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        return $conn->fetchAll($sql);
    }

    public function guardarAreasyPeriodosDePagos($objCollection)
    {
        $objCollection->save();
        return $objCollection;
    }

    public static function obtenerConfpagosporresultados($idestructura, $inicio = 0, $limite = 10000)
    {

        //Devolviendo el listado de tipos de pago en forma de arreglo.
        return Doctrine_Query::create()
            ->select('ntp.denominacion as denominacion,cpr.*')
            ->from('ConfPagosporresultado cpr')
            ->where('cpr.identidad = ?', array($idestructura))
            ->innerJoin('cpr.NomTipoPago ntp')
            ->limit($limite)
            ->offset($inicio)
            ->fetchArray();
    }

    public static function cantidadConfpagosporresultados($idestrcutura)
    {
        return Doctrine_Query::create()
        ->select('count(idpagoporresultado) as cantidad')
        ->from('ConfPagosporresultado cpr')
        ->where('cpr.identidad = ?', array($idestrcutura))
        ->innerJoin('cpr.NomTipoPago ntp')
        ->fetchOne()->cantidad;
    }

    //Functions para el treecombo de Campos de la Nomina
    public function cargarTiposDeNominas($identidad)
    {
        $self = $this;
        //Los ids y denominaciones de los tipos de nominas
        $sqlTiposNominas = "select idtiponomina,denominacion from mod_nomina.nom_tiponomina";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrTiposNominas = $conn->fetchAll($sqlTiposNominas);

        //Array final con la estructura del treecombo
        $arrFinal = array();
        $cont = 0;
        if (!empty($arrTiposNominas)) {
            foreach ($arrTiposNominas as $tiponomina) {
                $sqlCamposNominas = "select emn.idestructuramodelodomina, emn.denominacion
                from mod_nomina.conf_estructuramodelosnomina emn
                inner join mod_nomina.conf_estructuramodelosnominaentidad emne on (emne.idestructuramodelodomina = emn.idestructuramodelodomina)
                where emne.idestructura = ? and emn.idtiponomina = ?";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $arrCamposNominas = $conn->fetchAll($sqlCamposNominas, array($identidad, $tiponomina['idtiponomina']));

                //Llenando el arreglo de Campos de las nóminas
                $arrFinal[$cont]['id'] = $tiponomina['idtiponomina'];
                $arrFinal[$cont]['text'] = $tiponomina['denominacion'];

                $contHojas = 0;
                $arrayhojas = array();
                foreach ($arrCamposNominas as $campos) {
                    $arrayhojas[$contHojas]['id'] = $campos['idestructuramodelodomina'];
                    $arrayhojas[$contHojas]['text'] = $campos['denominacion'];
                    $arrayhojas[$contHojas]['leaf'] = true;
                    $contHojas++;
                }
                $arrFinal[$cont]['leaf'] = false;
                $arrFinal[$cont]['children'] = $arrayhojas;
                $cont++;
            }
        }
        //print_r($arrFinal);die;
        return $arrFinal;
    }

    public function devPagosPorResultadosPorId($idpagoresultado)
    {
        $query = new Doctrine_Query();
        $result = $query->select('pagreslt.*,nomtp.denominacion as dentipopago')
            ->from('ConfPagosporresultado pagreslt')
            ->innerJoin('pagreslt.NomTipoPago nomtp')
            ->where("pagreslt.idpagoporresultado in ($idpagoresultado)");
        return $result->fetchArray();
    }

    public function existePagosPorResultadosPorIdEntidadIdTipoPago($identidad, $idtipopago)
    {
        $query = new Doctrine_Query();
        $result = $query->select('count(idpagoporresultado) as cantidad')
            ->from('ConfPagosporresultado')
            ->where("identidad = ? and idtipopago = ?", array($identidad, $idtipopago));
        return $result->fetchOne()->cantidad;
    }

}

