<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class DatCargo extends BaseDatCargo
{
    /**
     * Configuración de las relaciones existentes
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatCargocivil', array('local' => 'idcargo', 'foreign' => 'idcargo'));
        $this->hasMany('DatCargomilitar', array('local' => 'idcargo', 'foreign' => 'idcargo'));
        $this->hasOne('DatProyecto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasOne('NomSalario', array('local' => 'idsalario', 'foreign' => 'idsalario'));
        $this->hasOne('NomPreparacion', array('local' => 'idpreparacion', 'foreign' => 'idpreparacion'));
        $this->hasOne('NomCargo', array('local' => 'idnomcargo', 'foreign' => 'idnomcargo'));
        $this->hasOne('NomFilaestruc', array('local' => 'idcargo', 'foreign' => 'idfila'));
        $this->hasOne('NomEstado', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasOne('NomTipoEscala', array('local' => 'idtipoescala', 'foreign' => 'idtipoescala'));
        $this->hasOne('NomSector', array('local' => 'idsector', 'foreign' => 'idsector'));
    }

    /**
     * Busca todos los elementos de la tabla que se correspondan con el id pasado por parametro
     *
     * @author    : Ing.Osvaldo Manuel Gonzalez Ortiz
     *
     * @param $idcargo
     * @param $idProyecto
     *
     * @return mixed : Retorna un arreglo con las instancias de la tabla encontradas
     * @copyright Copyright (c) 2014 xetid
     */
    public function buscar($idcargo, $idProyecto = false)
    {
        if (is_array($idcargo)) {
            $idcargo = $idcargo['idcargo'];
        }
        $query = new Doctrine_Query();
        $whereWith = 'c.idestado = 0';
        if (is_numeric($idProyecto)) {
            $whereWith = "((c.idestado = 0 and c.modificado [$idProyecto]=0) OR ( c.idproyecto = $idProyecto))";
        }
        $result = $query->select('c.*, cc.idcategocup as idcategocup, cm.idgrado as idgrado, g.idicono as icongrado')
                        ->from('DatCargo c')->leftjoin('c.DatCargocivil cc WITH c.idproyecto = cc.idproyecto')
                        ->leftjoin('c.DatCargomilitar cm WITH c.idproyecto = cm.idproyecto')->leftjoin(
                        'cm.NomGrado g'
            )->where("idcargo = $idcargo AND $whereWith")->execute()->toArray();





        foreach ($result as $index => $cargo) {
               $esp_prep= $this->obtenerEspecialidades($cargo['idespecialidadpreparacion']);
               $esp_empleo= $this->obtenerEspecialidades($cargo['idespecialidadempleo']);

            $result[$index]['icongrado'] = NomIcono::buscar($cargo['icongrado']);
            $result[$index]['especialidad_preparacion'] =$esp_prep;
            $result[$index]['especialidad_empleo'] =$esp_empleo;
        }

        return $result;
    }

    public function obtenerEspecialidades($idespecialidad){

        $mg           = Doctrine_Manager::getInstance();
        $conn         = $mg->getCurrentConnection();

        $especialidades = "SELECT idespecialidad, idpadre, ordenizq, ordender, abrevespecialidad,
       denespecialidad, codespecialidad, nivel, fechaini, fechafin,
       controlmaterial
  FROM mod_datosmaestros.nom_especialidad WHERE  idespecialidad = $idespecialidad";

        $especialidad =    $conn->fetchAll($especialidades);
        return $especialidad[0]['denespecialidad'];
    }

    /**
     * Obtiene todos los cargos que contienen una denominacion especificada
     *
     * @author    : Ing. Yoandy Borges
     * @modified  : Ing. Osvaldo Gonzalez
     *
     * @param int $idNomCargo
     * @param int $nodo
     * @param     $isCivil
     * @param     $idCategocup
     *
     * @internal  param bool $esModificar , Bandera para saber cuando es que se pide al modificar
     * @return bool : TRUE o FALSE en caso de existir elementos iguales a los criterios de busqueda
     * @copyright Copyright (c) 2013 xetid
     */
    public function existeDenominacion($idNomCargo, $nodo, $isCivil, $idCategocup)
    {
        $query = Doctrine_Query::create();
        $query->select('f.idfila')->from('NomFilaestruc f')->innerjoin('f.DatCargo c WITH c.idproyecto = 0')->where(
              "c.idnomcargo = $idNomCargo"
            )->andwhere("f.idpadre = $nodo and f.fechafin is null");
        if ($isCivil) {
            $query->innerjoin('c.DatCargocivil cc WITH cc.idproyecto = 0')->andWhere("cc.idcategocup = $idCategocup");
        } else {
            $query->innerjoin('c.DatCargomilitar cm WITH cm.idproyecto = 0');
        }
        $resultado = $query->execute()->count();
        if ($resultado > 0) {
            return true;
        }

        return false;
    }
}