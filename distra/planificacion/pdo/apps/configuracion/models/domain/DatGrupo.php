<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatGrupo extends BaseDatGrupo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomNomenclador',
            array('local'    => 'idgrupo', 'foreign' => 'idnomenclador',
                  'refClass' => 'DatGrupoNomNomenclador')
        );
        $this->hasMany(
            'DatGrupoUsuario',
            array('local' => 'idgrupo', 'foreign' => 'idgrupo')
        );
    }

    static public function ObtenerGruposPorLimite($params)
    {
        $idusuario = $params->idusuario;
        $limit = $params->limit;
        $start = $params->start;
        //$idgrupo = $params->idgrupo;        
        $filters = $params->filters;
        $cadena = "g.idusuariocrea = $idusuario";
        $dengrupo = $filters[0]['field'];
        $data = $filters[0]['data']['value'];
        if ($filters[1] != null) {
            $dengrupob = $filters[1]['field'];
            $datab = $filters[1]['data']['value'];
            if ($dengrupo == 'dengrupo') {
                if ($datab == 'Si') {
                    $datab = 1;
                } else {
                    $datab = 0;
                }
                $cadena = $cadena . " AND g." . $dengrupo . " ILIKE '%$data%' AND g."
                    . $dengrupob . " =" . $datab;
            } else {
                if ($data == 'Si') {
                    $data = 1;
                } else {
                    $data = 0;
                }
                $cadena = $cadena . " AND g." . $dengrupob . " ILIKE '%$datab%' AND g."
                    . $dengrupo . " =" . $data;
            }
        } else {
            if ($dengrupo == 'dengrupo') {
                $cadena = $cadena . " AND g." . $dengrupo . " ILIKE '%$data%'";
            } else {
                if ($dengrupo == 'activo') {
                    if ($data == 'Si') {
                        $data = 1;
                    } else {
                        $data = 0;
                    }
                    $cadena = $cadena . " AND g." . $dengrupo . " =" . $data;
                }
            }
        }
        $query = new Doctrine_Query();
        $resultadototal = $query->select('g.*')
            ->from('DatGrupo g')
            ->where($cadena)
            ->execute();
        $resultadototal = $resultadototal->toArray();
        $total = count($resultadototal);
        $resultadopaginado = $query->select('g.*')
            ->from('DatGrupo g')
            ->where($cadena)
            ->offset($start)
            ->limit($limit)
            //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        $resultadopaginado = $resultadopaginado->toArray();
        $resultado['total'] = $total;
        $resultado['datos'] = $resultadopaginado;
        return $resultado;
    }

    static public function GetGruposPorPropietario($idusuariocrea)
    {
        $activo = 1;
        $query = new Doctrine_Query();
        $result = $query->select('g.*')
            ->from('DatGrupo g')
            ->where("g.idusuariocrea = $idusuariocrea AND g.activo = $activo ")
            ->execute();
        return $result->toArray();
    }

    static public function GetGrupos()
    {
        $activo = 1;
        $query = new Doctrine_Query();
        $result = $query->select('g.*')
            ->from('DatGrupo g')
            ->where("g.activo = $activo ")
            ->execute();
        return $result->toArray();
    }

    public function GetGruposIguales($idusuariocrea, $dengrupo)
    {
        $cons = "SELECT g.* FROM mod_objetivos.dat_grupo g 
            WHERE g.idusuariocrea = '$idusuariocrea' AND g.dengrupo = '$dengrupo'";
        $connb = Doctrine_Manager:: connection();
        $res = $connb->execute($cons);
        $result = $res->fetchAll();
        return $result;        
    }

    public function GetGruposIgualesModificar(
        $idusuariocrea, $dengrupo, $idgrupo
    )
    {
        $cons = "SELECT g.* FROM mod_objetivos.dat_grupo g 
            WHERE g.idusuariocrea = '$idusuariocrea' 
            AND g.dengrupo = '$dengrupo' AND g.idgrupo != '$idgrupo'";
        $connc = Doctrine_Manager:: connection();
        $res = $connc->execute($cons);
        $result = $res->fetchAll();
        return $result;
    }

    static public function GetGruposIdGrupo($idgrupo)
    {
        $query = new Doctrine_Query();
        $result = $query->select('g.*')
            ->from('DatGrupo g')
            ->where('g.idgrupo = ?', $idgrupo)
            ->execute();
        return $result->toArray();
    }

    static public function GetGrupoIdGrupoProp($idgrupo, $idusuarioprop)
    {
        $query = new Doctrine_Query();
        $result = $query->select('g.*')
            ->from('DatGrupo g')
            ->where("g.idgrupo = $idgrupo AND g.idusuarioprop = $idusuarioprop")
            ->execute();
        return $result->toArray();
    }

    public function CountGrupos($idusuario)
    {
        $query = Doctrine_Query::create();
        return $query->from('DatGrupo g')
            ->where('g.idusuariocrea = ?', $idusuario)
            ->count();
    }

    public function DameGruposDadoUsuarioDen($idusuario, $denominacion)
    {
      if($denominacion == null){
        $query = Doctrine_Query::create();
        $result = $query->select('dg.*')
                        ->from('DatGrupo dg')
                        ->where(
                          "dg.idusuariocrea = $idusuario"
                        )
                        ->execute();
      }else{
        $query = Doctrine_Query::create();
        $result = $query->select('dg.*')
                        ->from('DatGrupo dg')
                        ->where(
                          "dg.idusuariocrea = $idusuario AND UPPER(dg.dengrupo) ILIKE ? ",
                          ("%" . strtoupper($denominacion) . "%")
                        )
                        ->execute();
      }

        return $result->toArray();
    }

    public function ObtenerGruposDeUsuarios($idusuario, $estado)
    {
        $cadena = "g.idusuariocrea = $idusuario";
        if ($estado != '' && $estado != 10) {
            $cadena = $cadena . " AND g.activo = $estado";
        }
        $query = new Doctrine_Query();
        $result = $query->select('g.*')
            ->from('DatGrupo g')
            ->where($cadena)
            ->limit($limite)
            ->offset($inicio)
            ->execute();
        return $result->toArray();
    }
    
}

//fin clase 
