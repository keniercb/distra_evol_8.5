<?php

class DatRangonumerocontrolModel extends NomencladoresModel
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarNomenclador($params)
    {
        if ($this->verificarExistencia($params) === 0) {
            $obj = new DatRangonumerocontrol();
            $obj->idestructuracomun = $this->global->Estructura->idestructura;
            $obj->synchronizeWithArray($params);
            if ($params['nrodocumentoinicial']) {
                $nrodoc = new DatRangonumerodocumento();
                $nrodoc->synchronizeWithArray($params);
                $obj->DatRangonumerodocumento = $nrodoc;
            }
            if ($params['idseriedocentidad'])
                $obj->DatSeriedocentidadrango[0]->idseriedocentidad = $params['idseriedocentidad'];
            if ($params['idpuestotrabajo'])
                $obj->DatPuestotrabajorango[0]->idpuestotrabajo = $params['idpuestotrabajo'];
            $obj->save();
            /*$nrodocumentoinicial = $params['nrodocumentoinicial'];
            $nrodocumentofinal = $params['nrodocumentofinal'];
            $nrocontrolinicial = $params['nrocontrolinicial'];
            while ($nrodocumentoinicial <= $nrodocumentofinal) {
                $nrocontrol = new DatNumerocontrol();
                $nrocontrol->synchronizeWithArray([
                    'idseriedocentidad' => $params['idseriedocentidad'],
                    'nrocontrol' => $nrocontrolinicial,
                    'nrodocumento' => $nrodocumentoinicial,
                    'anulado' => 0,
                    'asignado' => 0,
                ]);
                $inicialrango = (int) str_replace('-', '', $nrocontrolinicial);
                ++$inicialrango;
                $nrocontrolinicial = $this->formatControlNumber($inicialrango);
                ++$nrodocumentoinicial;
                $rango->DatNumerocontrol->add($nrocontrol);
            }*/
            //$rango->save();
            return true;
        }
        return false;
    }

    public function verificarExistencia($params)
    {
        $nrofacturainicio = (int) $params['nrodocumentoinicial'];
        $nrofacturafinal = (int) $params['nrodocumentofinal'];
        $nrocontrolinicial = (int) str_replace('-', '', $params['nrocontrolinicial']);
        $nrocontrolfinal = (int) str_replace('-', '', $params['nrocontrolfinal']);
        return Doctrine_Query::create()
                ->from('DatNumerocontrol')
                ->where(
                    "CAST(nrodocumento as int) = {$nrofacturainicio} "
                    . "OR CAST(nrodocumento as int) = {$nrofacturafinal} "
                    . "OR CAST(REPLACE(nrocontrol, '-', '') as int) = {$nrocontrolinicial}"
                    . "OR CAST(REPLACE(nrocontrol, '-', '') as int) = {$nrocontrolfinal}"
                )
                ->count();
    }

    public function activarNomenclador($params)
    {
        if($params['activo'] == 1){
            $rango = implode(',',json_decode(stripslashes($params['idnom'])));
            $conn = Zend_Registry::get('conexion');
            $sql = "SELECT * FROM mod_logfacturacion.f_generarnrocontrol("."'{".$rango."}'".",{$params['manual']})";
            $conn->execute($sql)->fetchAll();
        }else{
            $query = Doctrine_Query::create();
            $query->update('DatRangonumerocontrol')
                  ->set('activo', 0)
                  ->whereIn('idrango', json_decode(stripslashes($params['idnom'])))
                  ->execute();
        }
        return true;
    }

    public function eliminarNomenclador($params)
    {
        $rangos = json_decode(stripslashes($params['idnom']));
        Doctrine_Query::create()
            ->delete()
            ->from('DatRangonumerocontrol')
            ->where('idestructuracomun = ?', array($this->global->Estructura->idestructura))
            ->whereIn('idrango', $rangos)
            ->execute();
        Doctrine_Query::create()
            ->delete()
            ->from('DatNumerocontrol')
            ->whereIn('idrango', $rangos)
            ->execute();
        return true;
    }

    public function eliminaRango($array)
    {
        $coll = new Doctrine_Collection('DatRangonumerocontrol');
        $rangos = json_decode($array['rangos']);
        foreach ($rangos as $rango) {
            $objRango = Doctrine::getTable('DatRangonumerocontrol')->find($rango);
            $coll->add($objRango);
        }
        $coll->delete();

        /*$query = new Doctrine_Query();
        if ($objRango->idrango) {
            $res = $query->select('COUNT(nc.idrango) as cant ')
                ->from('DatNumerocontrol nc')
                ->where(" nc.idrango = ? and (nc.asignado = ? OR nc.anulado = ?)", array($rango->idrango, 1, 1))
                ->limit(1)
                ->fetchArray();
            if ($res[0]['cant'] == 0) {
                $objRango->delete();
            } else
                throw new ZendExt_Exception('LOGFACTCONF0002');
        } else
            throw new ZendExt_Exception('LOGFACTCONF0003');
        return array('codMsg' => 1, 'mensaje' => 'El rango de numeros ha sido eliminado satisfactoriamente.');*/
    }

}
