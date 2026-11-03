<?php

class NomMarca extends BaseNomMarca
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatMarcaEntidad', array('local' => 'idmarca', 'foreign' => 'idmarca'));
        $this->hasMany('DatMarcanaturaleza', array('local' => 'idmarca', 'foreign' => 'idmarca'));
        $this->hasMany('DatMarcamodelo', array('local' => 'idmarca', 'foreign' => 'idmarca'));
    }

    private function GetWhere($query, $alias, $parametros)
    {
        if (!$query) {
            $query = new Doctrine_Query();
        }
        if ($parametros['denominacion']) {
            $query->addWhere("$alias.denominacion iLike '{$parametros['denominacion']}%'");
        }

//        if ($parametros['idnaturaleza']) {
//            $query->addWhere("n.idnaturaleza = ?", $parametros['idnaturaleza']);
//        }
        if ($parametros['idmarca']) {
            $query->addWhere("mm.idmarca = ?", $parametros['idmarca']);
        }

        if ($parametros['estado']) {
            $query->addWhere("mm.estado = ?", $parametros['estado']);
        }

        if ($parametros['limit']) {
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }
        if (isset($parametros['incluirvencidas']) && $parametros['incluirvencidas'] != 2) {
            $fechacontable = $fechacontable = date('d/m/Y');
            $query->addWhere("mm.fechainicio <= '{$fechacontable}'");
            $query->addWhere("mm.fechafin >= '{$fechacontable}' OR mm.fechafin is NULL");
        }

        if ($parametros['idestructuracomun']) {
            $query->addWhere("me.idestructuracomun = ? ", array($parametros['idestructuracomun']));
           // $query->orWhere("mm.idmarca =-1");
            
        }

        return $query;
    }

    //
    //    private function GetWheres($query, $alias, $parametros)
    //    {
//if (!$query) {
//$query = new Doctrine_Query();
//}
    //        $query->addWhere("$alias.idmarca <> $alias.idpadre");
    //
    //        if ($parametros['denominacion']) {
    //            $query->addWhere("$alias.denominacion iLike '%{$parametros['denominacion']}%'");
    //        }
    //
    //        if ($parametros['idpadre']) {
    //            $query->addWhere("$alias.idpadre = ?", $parametros['idpadre']);
    //        }
    //
    //        if ($parametros['idnaturaleza']) {
    //            $query->addWhere("n.idnaturaleza = ?", $parametros['idnaturaleza']);
    //        }
    //
    //        if ($parametros['limit']) {
    //            $query->offset($parametros['start']);
    //            $query->limit($parametros['limit']);
    //        }
    //
    //        return $query;
    //    }
    //
    public function GetDatos($parametros)
    {
        $query = new Doctrine_Query();

        $query->from('NomMarca mm')/*->innerJoin('mm.DatMarcanaturaleza mmn')->innerJoin(
            'mmn.NomNaturaleza n'
        )*/
        ->leftJoin('mm.DatMarcaEntidad me');
        $query->addSelect(
            'mm.idmarca, mm.denominacion, mm.fechainicio, mm.fechafin, mm.idmarca as id,
            mm.denominacion as text, mm.estado, false as leaf, mm.codigo'
        );

        $query->addSelect(
            'me.idestructuracomun as usarentidad'
        );

        $query = self::GetWhere($query, 'mm', $parametros);
        $query->orderBy('mm.denominacion ASC');
        if ($parametros['getDQL']) {
            return $query;
        }
        return $query->fetchArray();
    }

    public function GetCantDatos($parametros)
    {
        unset($parametros['start']);
        unset($parametros['limit']);

        $query = new Doctrine_Query();

        $query->from('NomMarca mm')/*->innerJoin('mm.DatMarcanaturaleza mmn')->innerJoin(
            'mmn.NomNaturaleza n'
        )*/
        ->leftJoin('mm.DatMarcaEntidad me');

        $query = self::GetWhere($query, 'mm', $parametros);

        /*        if ($parametros['idnaturaleza']) {
                    $query->addWhere("n.idnaturaleza = ?", $parametros['idnaturaleza']);
                }*/

        return $query->count();
    }

    //
    //    public function Gets($parametros)
    //    {
    //        $query = new Doctrine_Query();
    //
    //        $query->from('NomMarca mm')->innerJoin('mm.DatMarcanaturalezas mmn')->innerJoin(
    //            'mmn.NomNaturaleza n'
    //        )->leftJoin('mm.DatMarcaEntidad mme');
    //
    //        $query->addSelect(
    //            'mm.idmarca, mm.idpadre, mm.denominacion, mm.estado, mme.idmarcaentidad as usarentidad, n.denominacion as denominacionnaturaleza'
    //        );
    //
    //        $query = self::GetWheres($query, 'mm', $parametros);
    //
    //        return $query->fetchArray();
    //    }

    //        public function GetCants($parametros)
    //        {
    //            unset($parametros['start']);
    //            unset($parametros['limit']);
    //
    //            $query = new Doctrine_Query();
    //
    //            $query->from('NomMarca mm')->innerJoin('mm.DatMarcanaturalezas mmn')->innerJoin(
    //                'mmn.NomNaturaleza n'
    //            );
    //            $query = self::GetWheres($query, 'mm', $parametros);
    //
    //            return $query->count();
    //        }
    //
    public function IsMarcaDuplicada($parametros, $modificar)
    {
        // false - No duplicado, identificador - Duplicado distinta naturaleza, 'dup' - Dup misma naturaleza
        $query = new Doctrine_Query();

        $query->select('mm.idmarca');
        $query->from('NomMarca mm')/*->innerJoin('mm.DatMarcanaturaleza mmn')*/
        ;
        $query->addWhere("mm.denominacion iLike '{$parametros['denominacion']}'");
        if ($parametros['idmarca'] && $modificar) {
            $query->addWhere("mm.idmarca <> {$parametros['idmarca']}");
        }

        $respuesta = $query->fetchArray();
        //$relacion = $respuesta[0]['DatMarcanaturaleza'];

        if (count($respuesta) == 0) {
            return false;
        } else {
            return 'dup';
        };/* else if (count($relacion) == 1) {

            //  Duplicado en una naturaleza distinta
            if (intval($relacion[0]['idnaturaleza']) != intval($parametros['idnaturaleza'])) {
                return $relacion[0]['idmarca'];
            }

            //  Duplicado en la misma naturaleza
            return 'dup';
        }*/

        //  Si la marca se encuentra en más de una naturaleza, verificamos que no este duplicada en la seleccionada
        /*foreach ($relacion as $value) {
            if (intval($value['idnaturaleza']) == intval($parametros['idnaturaleza'])) {
                return 'dup';
            }
        }*/

        return $respuesta[0]['idmarca'];
    }

    public function GetRealacionesMarca($idmarca)
    {
        return Doctrine::getTable('DatMarcanaturaleza')->findByDql(
            'idmarca = ?', array($idmarca)
        );
    }
}