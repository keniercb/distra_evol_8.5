<?php

class DatPlanPatrimonio extends BaseDatPlanPatrimonio
{

    public function setUp()
    {
        parent :: setUp();
        $this->hasMany('SegUsuario', array('local' => 'idaprobadopor', 'foreign' => 'idusuario'));
        $this->hasMany('SegUsuario', array('local' => 'idpropuestopor', 'foreign' => 'idusuario'));
        $this->hasOne('NomEspecialidad', array('local' => 'idespecialidad', 'foreign' => 'idespecialidad'));
    }

    public function obtenerPlanes($datos)
    {        
        $query = new Doctrine_Query();
        $query->from('DatPlanPatrimonio dp');

        $query->addSelect(
            " dp.idplan, 
                dp.ano as ano,   
                dp.estado as estado,  
                dp.plan as plan,
                dp.idpropuestopor,
                dp.idaprobadopor,
                dp.idespecialidad as idespecialidad
                "
        );

        $query = $this->getFilter($datos, $query);

        if ($datos['plan']){
            $query->addwhere("dp.plan = ?", $datos['plan']);
        }
        if($datos['comparaciones']){
            $query = $this->comparacionSigno($query, $datos);
        }    

        return $query->fetchArray();
    }

    public function getFilter($datos, $query)
    {
        if ($datos['ano'])
            $query->addwhere("dp.ano = ?", $datos['ano']);

        if($datos['denominacionEstado']){
             $datos['estado'] = $datos['denominacionEstado'];
        }
        if ($datos['estado']) {
            $datos['estado'] = is_array($datos['estado']) ? $datos['estado'] : array($datos['estado']);
            $query->andWhereIn("dp.estado", $datos['estado']);
        }
        if ($datos['especialidad']) {
            $query->addwhere("dp.idespecialidad = ?", $datos['especialidad']);
        }
        if ($datos['identidad']) {
            $query->addwhere("dp.idestructura = ?", $datos['identidad']);
        } else {
            $query->addwhere("dp.idestructura = ?", -1);
        }
        
        /* $query->addWhere(
                    "nmarc.denominacion ILIKE '%{$filtro->value}%' OR "
                    . "nmod.denominacion ILIKE '%{$filtro->value}%' OR "
                    . "i.denominacion ILIKE '%{$filtro->value}%'"
                );*/
       /* if($datos['denominacionEstado']){
            $this->concatenarEstados($datos);
        }*/
        return $query;
    }
    
    public function comparacionSigno($query, $datos)
    {
       if($datos['comparaciones']){
           foreach ($datos['comparaciones'] as $signos){              
                $query->addwhere("dp.{$signos['campo']} {$signos['signo']}?", $signos['valor']);
           }
          return $query;
       }
    }

    public function adicionarPlanes($parametros, $idsusuario)
    {
        $versiexisteano = $datIde = Doctrine::getTable('DatPlanPatrimonio')->findByDql(
            'ano = ? AND idespecialidad=?', array($parametros->ano, $parametros->idespecialidad)
        );
        if (count($versiexisteano) > 0)
            return 2;

        $plan = new DatPlanPatrimonio();
        $plan->synchronizeWithArray($parametros);
        $plan->idpropuestopor = $idsusuario;
        $plan->idaprobadopor = null;
        $plan->save();
        return 1;
    }

    public function eliminarplan($idsplan)
    {
        foreach ($idsplan as $plan) {
            $del = Doctrine::getTable('DatPlanPatrimonio')->find($plan);
            if ($del) {
                $del->delete();
            }
        }
    }

    public function confaprobarcancelarplan($parametros)
    {

        foreach ($parametros['idplan'] as $idplan) {
            $query = Doctrine::getTable('DatPlanPatrimonio')->find($idplan);
            if ($query) {
                $query->estado = $parametros['idestado'];
                if ($parametros['idestado'] == 5) {
                    $query->idaprobadopor = $parametros['idaprobadopor'];
                    $query->save();
                }
                if ($parametros['idestado'] == 2) {
                    $query->idaprobadopor = null;
                    $query->save();
                }
                if ($parametros['idestado'] == 1) {
                    $query->save();
                }
            }
        }
        return $parametros['idestado'];
    }

}
