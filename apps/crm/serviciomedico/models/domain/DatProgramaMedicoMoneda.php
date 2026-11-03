<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 2:56 PM
 */
class DatProgramaMedicoMoneda extends BaseDatProgramaMedicoMoneda
{

    public function setUp()
    {
        parent::setUp();
    }

    public function listarProgramasMedicosMonedas($params){
        try {
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $where = '';
            $where2 = '';
            $offset = '';

            $result = $conexionActual->fetchAll("
                SELECT count(pm.idprogramamedico) over, pm.*, (p.nombre||' '||p.papel||' '||p.sapel) as emisor,
                       e.denespecialidad as especialidad, cp.nombre as condicionpago, 
                       tc.denominacion as tipocontacto, c.nombre as clienteproveedor
                FROM mod_programamedico.dat_programamedico pm
                LEFT JOIN mod_datosmaestros.nom_clientesproveedores c ON c.idclientesproveedores=pm.idpaciente
                LEFT JOIN mod_persona.dat_persona p1 ON p1.idpersona=pm.idemisor
                LEFT JOIN mod_datosmaestros.nom_especialidad e ON e.idespecialidad=pm.idespecialidad
                LEFT JOIN mod_datosmaestros.nom_terminosdepago cp ON cp.idterminodepago=pm.idcondicionpago
                LEFT JOIN mod_persona.nom_tipomediocontacto tc ON tc.idtipomediocontacto=pm.idtipocontacto
            ");
            return array('success' => true, 'total' => count($result) == 0 ? 0 : $result[0]['count'], 'data' => $result);
        }catch (Exception $e) {
            throw $e;
        }
    }

    public function getMonedasByProgramaMedico($idprogramamedico){
        try {
//            $result=Doctrine::getTable('getMonedasByProgramaMedico')
//                ->findBy('idprogramamedico', $idprogramamedico);
            $conexion = Doctrine_Manager::getInstance()->getCurrentConnection();
            $result=$conexion->fetchAll(
                "SELECT pmm.*, nm.codigoiso
                    FROM mod_programamedico.dat_programamedicomoneda pmm
                    LEFT JOIN mod_datosmaestros.nom_moneda nm ON nm.idmoneda=pmm.idmoneda"
            );
            return $result;
        }catch (Exception $e) {
            throw $e;
        }
    }

}