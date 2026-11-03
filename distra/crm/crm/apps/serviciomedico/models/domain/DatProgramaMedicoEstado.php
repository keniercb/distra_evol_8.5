<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 2:56 PM
 */
class DatProgramaMedicoEstado extends BaseDatProgramaMedicoEstado
{

    public function setUp()
    {
        parent::setUp();
    }

    public function listarProgramasMedicosEstados($params){
        try {
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $where = '';
            $where2 = '';
            $offset = '';

            $result = $conexionActual->fetchAll("
                SELECT count(pm.idprogramamedico) over(), pm.*, (p1.nombre||' '||p1.papel||' '||p1.sapel) as emisor,
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

    public function guardarProgramasMedicosEstados($params){
        try{
            $instance=new DatProgramaMedicoEstado();
            $instance->idestado=$params['idestado'];
            $instance->idprogramamedico=$params['idprogramamedico'];
            $instance->fechainicio=$params['fechainicio'];
            $instance->idusuario=$params['idusuario'];
            $instance->save();
        }catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerUltimoEstado($idprogramamedico)
    {
        $result=Doctrine_Query::create()
            ->select('*')
            ->from('DatProgramaMedicoEstado')
            ->where('fechafin is NULL and idprogramamedico =? ', $idprogramamedico)->fetchArray();
        return count($result)?$result[0]:null;
    }

    public function actualizarRolesObligatorios($rolesobligatorios, $idprogramamedico)
    {
        Doctrine_Query::create()
            ->update('DatProgramaMedicoEstado')
            ->set('rolesobligatorios', '?', $rolesobligatorios)
            ->where('fechafin is NULL AND idprogramamedico =? ', $idprogramamedico)->execute();
    }

    public function actualizarFechaFinEstadoCuliminado($fechafin, $idprogramamedico)
    {
        Doctrine_Query::create()
            ->update('DatProgramaMedicoEstado')
            ->set('fechafin', '?', $fechafin)
            ->where('fechafin is null and idprogramamedico =? ', $idprogramamedico)->execute();
    }

}
