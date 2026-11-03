<?php
class ConfConceptosGeneralesNominaModel extends ZendExt_Model {

    public function ConfConceptosGeneralesNominaModel() {
        parent::ZendExt_Model();
    }

    public function adicionarConceptoGeneralNomina($arregloDatos) {
        $obj = new ConfConceptosGeneralesNomina();
        $obj->idconceptorm 				 = $arregloDatos['idconceptorm'];
        $obj->idsistemapago         	 = $arregloDatos['idsistemapago'];
        $obj->idtipopago         	   	 = $arregloDatos['idtipopago'];
        $obj->idexpresionmatematica	     = $arregloDatos['idexpresionmatematica'];
        $obj->identidad             	 = $arregloDatos['identidad'];
        $obj->calcularpluriempleo        = $arregloDatos['pluriempleo'];
        $obj->calcularperiodomensual     = $arregloDatos['periodomensual'];
        $obj->lugaresdecimales     = $arregloDatos['lugaresdecimales'];
        $obj->save();
    }

    public function modificarConceptoGeneralNomina($id, $arregloDatos) {
        $obj = Doctrine::getTable('ConfConceptosGeneralesNomina')->find($id);
        $obj->idconceptorm 				= $arregloDatos['idconceptorm'];
        $obj->idsistemapago         		= $arregloDatos['idsistemapago'];
        $obj->idtipopago         				= $arregloDatos['idtipopago'];
        $obj->idexpresionmatematica	= $arregloDatos['idexpresionmatematica'];
        $obj->identidad             			= $arregloDatos['identidad'];
        $obj->calcularpluriempleo        = $arregloDatos['pluriempleo'];
        $obj->calcularperiodomensual     = $arregloDatos['periodomensual'];
        $obj->lugaresdecimales     = $arregloDatos['lugaresdecimales'];
        $obj->save();
    }
    
    public function eliminarConceptoGeneralNomina($id) {
        if ($id) {
            $obj = Doctrine::getTable('ConfConceptosGeneralesNomina')->find($id);
            if ($obj) {
                $obj->delete();
            }
        }
    }
    public function eliminarConceptoGeneralNominaid($id) {

        $sql = "delete from mod_nomina.conf_conceptosgeneralesnomina where mod_nomina.conf_conceptosgeneralesnomina.idconfconceptosgeneralesnomina
in(" . implode(',', $id) . " ) ;";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }


    public function replicarConceptoGeneralNomina($id, $idEstructura, $tipopago)
    {
        $obj1 = new ConfConceptosGeneralesNomina();

        $obj = Doctrine::getTable('ConfConceptosGeneralesNomina')->find($id['idconceptogeneralesnomina']);

        $cantexistentes = ConfConceptosGeneralesNomina::idConceptosGeneralesNomina ($idEstructura, $obj->idconceptorm, $tipopago);

        if(count($cantexistentes)>0){
            foreach($cantexistentes as $kext=>$vext){

                $cantexistentes = ConfConceptosGeneralesNomina::deleteConceptosGeneralesNomina ($vext['idconfconceptosgeneralesnomina']);
            }

        }

//        if ($cantexistentes == 0) {
            //Creando una nueva formula con los mismos elementos pero con diferente id
            $nuevoidformula = ConfConceptospdFormasySistemasPagoModel::crearFormulaNueva($obj->idexpresionmatematica);

            $dirleer = $_SERVER['DOCUMENT_ROOT'].'/pvd/comun/indicadoresexpresonmatematica/'.$obj->idexpresionmatematica.'.iem';
            $datosserializados = file_get_contents($dirleer);
            $dirguardar = $_SERVER['DOCUMENT_ROOT'].'/pvd/comun/indicadoresexpresonmatematica/'.$nuevoidformula.'.iem';
            file_put_contents($dirguardar, $datosserializados);


            $obj1->idconceptorm = $obj->idconceptorm;
            $obj1->idsistemapago = $obj->idsistemapago;
            $obj1->idtipopago = $tipopago;
            $obj1->idexpresionmatematica = $nuevoidformula;
            $obj1->identidad = $idEstructura;
            $obj1->calcularpluriempleo = $obj->calcularpluriempleo;
            $obj1->calcularperiodomensual = $obj->calcularperiodomensual;
            $obj1->save();


//        }
        return 'ok';
    }

    //eliminar multiple
    public function dameIdConceptoRM($idconfconceptosgeneralesnomina)
    {
        $obj = Doctrine::getTable('ConfConceptosGeneralesNomina')->find($idconfconceptosgeneralesnomina);
        // print_r($idconfconceptosgeneralesnomina);die;
        return $obj->idconceptorm;
    }

    //eliminar multiple
    public function dameIdconfconceptosgeneralesnomina($idtipopago, $idconceptorm, $identidad)
    {
        //Devolviendo la cantidad total de los salarios especificos.
        $query  = new Doctrine_Query ();
        $result = $query->select('p.idconfconceptosgeneralesnomina')
            ->from('ConfConceptosGeneralesNomina p')
            ->where("p.idconceptorm=? and p.identidad=? and p.idtipopago=? ", array($idconceptorm, $identidad, $idtipopago))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->fetchOne();

        return $result;
    }
}
