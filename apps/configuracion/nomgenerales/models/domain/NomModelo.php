<?php

class NomModelo extends BaseNomModelo
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatMarcamodelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
    }

    private function GetWhere($query, $alias, $parametros)
    {
        if (!$query) {
            $query = new Doctrine_Query();
        }
        if ($parametros['denominacion']) {
            $query->addWhere("$alias.denominacion iLike '{$parametros['denominacion']}%'");
        }

        if ($parametros['idpadre']) {
            $query->addWhere("mm.idmarca = ?", $parametros['idpadre']);
        }

        if ($parametros['idmarca']) {
            $query->addWhere("mm.idmarca = ?", $parametros['idmarca']);
        }

        if ($parametros['limit']) {
            $query->offset($parametros['start']);
            $query->limit($parametros['limit']);
        }
        if(isset($parametros['incluirvencidas']) && $parametros['incluirvencidas'] != 2){
            $fechacontable = date('d/m/Y');
            $query->addWhere("mod.fechainicio <= '{$fechacontable}'");
            $query->addWhere("mod.fechafin >= '{$fechacontable}' OR mod.fechafin is NULL");
        }

        return $query;
    }

    public function GetDatos($parametros)
    {
        $query = new Doctrine_Query();

        $query->from('NomModelo mod')->innerJoin('mod.DatMarcamodelo mm')->innerJoin(
            'mm.NomMarca m'
        )/*->innerJoin('mm.NomNaturaleza n')*/;

        $query->addSelect(
            'mod.idmodelo, mod.fechainicio, mod.fechafin, mod.denominacion,mod.idmodelo as id, mm.*,
            mod.denominacion as text, mod.estado,
            true as leaf '/*, n.denominacion as denominacionnaturaleza*/
        );

        $query = self::GetWhere($query, 'mod', $parametros);
        $query->orderBy('mod.denominacion ASC');
        return $query->fetchArray();
    }

    public function GetCantDatos($parametros)
    {      
        unset($parametros['start']);
        unset($parametros['limit']);
       
        $query = new Doctrine_Query();

        $query->from('NomModelo mod')->innerJoin('mod.DatMarcamodelo mm')->innerJoin(
            'mm.NomMarca n'
        );

        $query = self::GetWhere($query, 'mod', $parametros);
       
        return $query->count();//fetchArray();
    }

    public function IsModeloDuplicado($parametros, $modificar)
    {
        // false - No duplicado, identificador - Duplicado distinta marca, 'dup' - Dup misma marca
        $query = new Doctrine_Query();

        $query->from('NomModelo mod')->innerJoin('mod.DatMarcamodelo mm');
        $query->addWhere("mod.denominacion iLike '{$parametros['denominacion']}'");
        if ($parametros['idmodelo'] && $modificar) {
            $query->addWhere("mod.idmodelo <>{$parametros['idmodelo']}");
        }

        $respuesta = $query->fetchArray();

        $relacion = $respuesta[0]['DatMarcamodelo'];

        if (count($respuesta) == 0) {
            return false;

        } else if (count($respuesta) == 1 && count($relacion) == 1) {

            //  Duplicado en una marca distinta
            if (intval($relacion[0]['idmarca']) == intval($parametros['idpadre'])
                /*&& intval($relacion[0]['idnaturaleza']) == intval($parametros['idnaturaleza'])*/
            ) {
                //  Duplicado en la misma marca
                return 'dup';
            }

            return $relacion[0]['idmodelo'];
        }
        else {

            //  Si el modelo se encuentra en más de una marca, verificamos que no este duplicada en la seleccionada
            foreach ($respuesta as $value) {
                $relacion = $value['DatMarcamodelo'];

                foreach ($relacion as $value) {
                    if (intval($value['idmarca']) == intval($parametros['idpadre'])
                        /* && intval($value['idnaturaleza']) == intval($parametros['idnaturaleza'])*/
                    ) {
                        return 'dup';
                    }
                }
            }
            return $relacion[0]['idmodelo'];
        }
    }

    public function GetIdMarcaDadoIdModeloIdNaturaleza($idmodelo, $idnaturaleza)
    {
        $query = new Doctrine_Query();

        $query->from('DatMarcamodelo mm');
        $query->addWhere("mm.idmodelo = ? and mm.idnaturaleza = ?", array($idmodelo, $idnaturaleza));

        $respuesta = $query->fetchArray();

        return $respuesta[0]['idmarca'];
    }

    public function GetRealacionesModelo($idmodelo)
    {
        return Doctrine::getTable('DatMarcamodelo')->findByDql(
            'idmodelo = ?', array($idmodelo)
        );
    }
}