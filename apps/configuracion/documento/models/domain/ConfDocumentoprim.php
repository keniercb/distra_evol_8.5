<?php

/**
 * Clase modelo para datos de documentos primarios.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage Documento/Models/Domain
 * @copyright  XETID.
 * @version    1.0-0
 */
class ConfDocumentoprim extends BaseConfDocumentoprim
{

    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        parent::setUp();
    }

    public function getDocumentos($idplantilla,$idestructura){
        try {
            $manager = Doctrine_Manager::getInstance();
            $conexion = $manager->getCurrentConnection();
            $query = "SELECT m1.*,m2.idestructurasubsist FROM mod_datosmaestros.conf_documentoprim m1
                      INNER JOIN mod_datosmaestros.dat_estructurasubsist m2 ON m1.idsubsistema = m2.idsubsistema
                      INNER JOIN mod_datosmaestros.dat_fecha m3 on m3.idestructurasubsist = m2.idestructurasubsist
                      WHERE m1.idplantilla = $idplantilla AND m2.idestructuracomun = $idestructura";
            return $conexion->fetchAll($query);
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}
