<?php

class DatInversnivelactividad extends BaseDatInversnivelactividad {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatEtapaInversion', array('local' => 'idetapainversion', 'foreign' => 'idetapainversion'));
        $this->hasOne('DatActespcomportamiento', array('local' => 'idactespcomportamiento', 'foreign' => 'idactespcomportamiento'));        
        $this->hasMany('DatInversnivelactividaddesglose', array('local' => 'idinversnivelactividad', 'foreign' => 'idinversnivelactividad'));

    }
	
    public function getProy($param) {
//pre_r($param->datosinv->idinversion);die;
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
                    diep.idelemento,
                    dep.denelemento
            FROM mod_planifintegracion.dat_inversionelemento diep
            INNER JOIN mod_objetivos.dat_elementos dep ON (diep.idelemento= dep.idelemento)
            WHERE diep.idinversion = " . $param->datosinv->idinversion . "";
        $temp = $conn->execute($sql);
        return $temp->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getHijosInmediatos($idelemento){
        $cadenaA
            = "
            SELECT ee.idelementohijo, ee.origen, e.idelemento,e.idtipoelemento, e.denelemento
            FROM mod_objetivos.dat_elementos_dat_elementos ee
            INNER JOIN mod_objetivos.dat_elementos e
            ON(ee.idelementohijo = e.idelemento)
            WHERE ee.origen IN (0,1,2,3)
            AND ee.idelementopadre = {$idelemento} ";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getDatosTarea($idelemento){
        $cadenaA
            = "  SELECT t.duracionestimada, t.fechainicio, t.fechafin,
                t.horainicio, t.horafin ,e.gradocumplimiento
                FROM mod_planifproyecto.dat_tarea t
                 INNER JOIN mod_objetivos.dat_elementos e
                ON(t.idtarea=e.idelemento)
                WHERE idtarea = $idelemento";

//pre_r($cadenaA);die;
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadenaA)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getActividadesByInversion($params, $idespecialidad){
        $conn = Doctrine_Manager::connection();
        $sql = "select x.idactividad,
					   x.codigo as codigoactividad,
					   x.denominacion as denominacionactividad,
					   sum(x.nivelactividad) as nivel,
					   sum(x.importeactividad) as importeactividad
				from (
					   SELECT a.idactividad,
							  a.codigo,
							  a.denominacion,
							  eiac.nivelactividadinversion as nivelactividad,
							  sum(round(Coalesce(((dn.cantplanif / dn.cantbase) * ip.precio)) *
								eiac.nivelactividadinversion)) as importeactividad
					   FROM mod_planificacion.nom_actividad a
							INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON
							  a.idactividad = aec.idactividad AND aec.idespecialidad = " . $idespecialidad . "
							INNER JOIN mod_planifintegracion.dat_inversnivelactividad eiac ON
							  aec.idactespcomportamiento = eiac.idactespcomportamiento
							inner join mod_planificacion.dat_norma dn on dn.idactividad =
							  a.idactividad and dn.idejercicio =  " . $params['idejercicio'] . "
							inner join mod_datosmaestros.nom_indicadorplanif ip on (
							  ip.idindicador = dn.idindicador)
							inner join mod_planifinversiones.dat_etapainversion ei on (
							  ei.idetapainversion = eiac.idetapainversion)
							inner join mod_planifinversiones.dat_inversion inv on (
							  inv.idinversion = ei.idinversion)
					   WHERE a.nivel = 4 AND
							 (a.idaprobacion = 3 OR
							 a.idaprobacion = 4) AND
							 a.estado = 1 AND
							 inv.idinversion = " . $params['idinversion'] . "
					   group by a.idactividad,
								a.codigo,
								a.denominacion,
								eiac.nivelactividadinversion
					   order by a.codigo,
								a.denominacion
					 ) x
				group by x.idactividad,
						 x.codigo,
						 x.denominacion";
        $temp = $conn->execute($sql);
        return $temp->fetchAll(PDO::FETCH_ASSOC);
// pre_r($result);die;
    }
	
    public function getIndicadoresByInversion($params, $idespecialidad){
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT ni.codigo as codigoindicador,
					   ni.denominacion as denominacionindicador,
					   sum(round(Coalesce(((dn.cantplanif / dn.cantbase))) * eiac.nivelactividadinversion)) as cantidad,
					   sum(round(Coalesce(((dn.cantplanif / dn.cantbase) * ip.precio)) *eiac.nivelactividadinversion)) as importe
				FROM mod_planificacion.nom_actividad a
					 INNER JOIN mod_planificacion.dat_actespcomportamiento aec ON a.idactividad
					   = aec.idactividad AND aec.idespecialidad =  " . $idespecialidad . "
					 INNER JOIN mod_planifintegracion.dat_inversnivelactividad eiac ON
					   aec.idactespcomportamiento = eiac.idactespcomportamiento
					 inner join mod_planificacion.dat_norma dn on dn.idactividad = a.idactividad
					   and dn.idejercicio =  " . $params['idejercicio'] . "
					 inner join mod_datosmaestros.nom_indicadorplanif ip on (ip.idindicador =
					   dn.idindicador)
					 inner join mod_planifinversiones.dat_etapainversion ei on (
					   ei.idetapainversion = eiac.idetapainversion)
					 inner join mod_planifinversiones.dat_inversion inv on (inv.idinversion =
					   ei.idinversion)
					 inner join mod_datosmaestros.nom_indicador ni on (ni.idindicador =
					   ip.idindicador)
				WHERE a.nivel = 4 AND
					  (a.idaprobacion = 3 OR
					  a.idaprobacion = 4) AND
					  a.estado = 1 and
					  inv.idinversion =  " . $params['idinversion'] . "
				group by inv.codigo,
						 ni.codigo,
						 ni.denominacion
				order by inv.codigo,
						 ni.codigo,
						 ni.denominacion";
        $temp = $conn->execute($sql);
        return $temp->fetchAll(PDO::FETCH_ASSOC);
// pre_r($result);die;
	}
	
    public function guardarNiveles($params) {
        foreach ($params['arrayNiveles'] as $nivactividad) {
            /* Adicionar o actualizar */
            if ($nivactividad->idinversnivelactividad == null) {
                /* Adicionar */
               
                $objetapinvactespcomp = new DatInversnivelactividad();
                $objetapinvactespcomp->idetapainversion = $params['idetapainversion'];
                $objetapinvactespcomp->identidad = $params['identidad'];
                $objetapinvactespcomp->idactespcomportamiento = $nivactividad->idactespcomportamiento;
                $objetapinvactespcomp->nivelactividadinversion = $nivactividad->nivelactividadinversion;                              
                $objetapinvactespcomp->save();
            } else {
                /* Actualizar */
                $objetapinvactespcomp = Doctrine::getTable('DatInversnivelactividad')->findByDql("idinversnivelactividad = $nivactividad->idinversnivelactividad");                      
                $objetapinvactespcomp[0]->nivelactividadinversion = $nivactividad->nivelactividadinversion; 
                $objetapinvactespcomp[0]->save();
            }
        }
       return 1;
    }

}
