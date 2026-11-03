<?php

class NomTipotransferenciaModel extends NomencladoresModel
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarNomenclador($array)
    {
        $obj = parent::insertarNomenclador($array, true);
        if (is_object($obj)) {
            if ($array['adicionados']) {
                $adicionados = explode(',', $array['adicionados']);
                foreach ($adicionados as $value) {
                    $o = new NomTipotransferenciaarea();
                    $o->idnomtipoarea = $value;
                    $obj->NomTipotransferenciaarea[] = $o;
                    unset($o);
                }
            }
            $obj->save();
            return true;
        }
        return false;
    }

    public function modificarNomenclador($array)
    {
        $obj = parent::modificarNomenclador($array, true);
        if ($obj != -1 && $obj != -2) {
            if ($array['eliminados']) {
                Doctrine_Query::create()
                        ->delete()
                        ->from('NomTipotransferenciaarea')
                        ->where(
                                "idtipotransferencia = ?
                        AND idnomtipoarea in({$array['eliminados']})", array($array['idtipotransferencia'])
                        )
                        ->execute();
            }

            if ($array['adicionados']) {
                $adicionados = explode(',', $array['adicionados']);
                foreach ($adicionados as $value) {
                    $o = new NomTipotransferenciaarea();
                    $o->idnomtipoarea = $value;
                    $obj->NomTipotransferenciaarea[] = $o;
                    unset($o);
                }
            }
            //print_r($obj->toArray());die;
            $obj->save();
            return true;
        } else {
            return $obj;
        }
    }

    public function habilitarDesabiltarEntidad($array)
    {
        $arr = (!is_array($array['idnom'])) ? json_decode(
                        stripslashes($array['idnom'])
                ) : $array['idnom'];
        $qTipoares = Doctrine_Query::create()->select('ta.idnomtipoarea')
                ->from('NomTipotransferenciaarea ta')
                ->whereIn('ta.idtipotransferencia', $arr)
                ->fetchArray();
        $arrIdNomtipoArea = array();
        foreach ($qTipoares as $nTipoarea) {
            array_push($arrIdNomtipoArea, $nTipoarea['idnomtipoarea']);
        }
        if ($array['habilitarentidad'] == 1) {
            parent::habilitarDesabiltarEntidad(
                    array(
                        'idnom' => $arrIdNomtipoArea,
                        'habilitarentidad' => 1,
                        'modelo' => 'NomTipoarea',
                        'pkid' => 'idnomtipoarea'
                    )
            );
        }
        return parent::habilitarDesabiltarEntidad($array);
    }

}
