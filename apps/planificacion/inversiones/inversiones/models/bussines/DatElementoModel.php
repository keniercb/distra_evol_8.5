<?php

class DatElementoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function cargarElementoByidetapa($param) {
        return DatElemento::cargarElementoByidetapa($param);
    }

    public function adicionarInversionComponenteElemEspacio($param) {
        return DatElementodocgestordoc::adicionar($param);
    }

   public function addElemento($param) {

        foreach ($param as $value) {
            if ($value->idelemento != '') {
                $conn = Doctrine_Manager::connection();

                $query = "UPDATE mod_planifinversiones.dat_elemento 
                         SET denominacion = '" . $value->denelemento . "'

                          WHERE  idelemento = " . $value->idelemento . "
                            ";
                $total = $conn->execute($query);

                $query = "UPDATE mod_planifinversiones.dat_elementotipomodelo 
                         SET idtipomodelo = '" . $value->denominacion . "'

                          WHERE  idelemento = " . $value->idelemento . "
                            ";
                $total = $conn->execute($query);
            } else {
              
                $objElemento = new DatElemento();
                $objElemento->idetapa = $value->idetapa;
                $objElemento->documento = 0;
                $objElemento->parametrosdinamicos = ($value->denominacion) ? 1 : 0;
                $objElemento->denominacion = $value->denelemento;
                $idelemento = DatElemento::salvar($objElemento);


                    $objElementoTipomodelo = new DatElementotipomodelo();
                    $objElementoTipomodelo->idelemento = $idelemento;
                    $objElementoTipomodelo->idtipomodelo = ($value->denominacion) ? $value->denominacion :null;
                    DatElementotipomodelo::salvar($objElementoTipomodelo);
                    

            }
        }
        return true;
    }
    
    public function elementoEnUso($param) {
        return DatEtapaElementoinversion::elementoEnUso($param);
    }

    public function eliminarElemento($param) {

            foreach ($param as $elemento) {

                $objNomnombreetapa = DatElemento::getByid($elemento);
                $objNomnombreetapa->delete();
            }
            return true;

    }
    
    public function getIdcolumna($param) {
        $query  = "SELECT 
                    mod_planificacion.nom_tipomodelo.idtabla
                FROM
                    mod_planifinversiones.dat_elementotipomodelo
                    INNER JOIN mod_planifinversiones.dat_elemento ON (mod_planifinversiones.dat_elementotipomodelo.idelemento = mod_planifinversiones.dat_elemento.idelemento)
                    INNER JOIN mod_planificacion.nom_tipomodelo ON (mod_planifinversiones.dat_elementotipomodelo.idtipomodelo = mod_planificacion.nom_tipomodelo.idtipomodelo)
                WHERE mod_planifinversiones.dat_elemento.idelemento = " . $param['idelemento']. "";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        return $res->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getElementos() {
        return DatElemento::getElementos();
    }
}
