<?php
class DatPersonaModel extends ZendExt_Model {
    public $persona;

    public function DatPersonaModel() {
        $this->persona = new DatPersona();
        parent::ZendExt_Model();
    }

    public function Insertar(DatPersona $object) {
         $object->save();
		 return $object->idpersona;
    }

    public function Actualizar($object) {
        $object->save();
		return $object->idpersona;
    }

    public function Eliminar($object) {
        return $this->persona->Eliminar($object);
    }
	
	public function EliminarCompleto($object) {
        return $this->persona->EliminarCompleto($object);
    }

    public function cambiarSituacionPersonaByAlias($idpersona, $aliaSituacion){
        $this->conn->commit();//Cierra todas las conexiones existentes.
        try {
            $this->conn->beginTransaction();
            $objDomain = new DatPersona();
            $arrPersonas = $objDomain->Buscar($idpersona);
            $objDomainSituacion = new NomSituacionpersona();//Obtengo el id por el alias
            $idSituacion = $objDomainSituacion->getIdSituacionByAlia($aliaSituacion);
            if(is_array($idpersona)){
                foreach ($arrPersonas as $k => $v) {
                    if($arrPersonas[$k]->idsituacionpersona != $idSituacion[0]['idsituacionpersona']){
                        $arrPersonas[$k]->idsituacionpersona = $idSituacion[0]['idsituacionpersona'];
                    }
                }

            }elseif(is_numeric($idpersona)){
                $arrPersonas->idsituacionpersona = $idSituacion[0]['idsituacionpersona'];
            }
            $arrPersonas->save();
            $this->conn->commit();
        } catch (Exception $e) {
            throw $e;
        }
    }
	
    public function BuscarPersonaPorParam($params, $inicio, $limite, $idestructura, $iddominio, $permiso, $meta) {
        return $this->persona->BuscarPersonaPorParam($params,$limite, $inicio, $idestructura, $iddominio, $permiso, $meta);
    }
	public function countBuscarPersonaPorParam($params, $idestructura, $iddominio, $permiso) {
        return $this->persona->countBuscarPersonaPorParam($params, $idestructura, $iddominio, $permiso, $meta);
    }
	
	
	public function BuscarPersonaPorTexto($inicio, $limite, $texto, $idestructura, $iddominio, $permiso) {
        return $this->persona->Buscador($inicio, $limite, $texto, $idestructura, $iddominio, $permiso);
    }
	public function CantidadBuscarPersonaPorTexto($texto, $idestructura, $iddominio, $permiso) {
        return $this->persona->countBuscador($texto, $idestructura, $iddominio, $permiso);
    }
	

    public function GetPorLimite($start, $limit) {
        return $this->persona->GetPorLimite($start, $limit);
    }
	
	public function ObtenerPersonas($limit, $start) {
        return $this->persona->ObtenerPersonas($limit, $start);
    }
	public function ObtenerCantidadPersonas() {
        return $this->persona->ObtenerCantidadPersonas();
    }
	
	public function CantTotal() {		
        return count($this->persona->DevolverTodas());
    }

    public function DevolverTodas() {		
        return $this->persona->DevolverTodas();
    }
	
	public function DevolverPersonasArregloId($arreglo) {
        return $this->persona->DevolverPersonasArregloId($arreglo);
    }
	
	public function DevolverTodasLimit($start, $limit) {
        return $this->persona->DevolverTodasLimit($start, $limit);
    }
	
	public function contarPersonaService() {
        return $this->persona->contarPersonaService($start, $limit);
    }
    
    public function BuscarDatospersonacuotasPorID($arrIdPersonas, $idestructura, $iddominio, $permiso) {
        return $this->persona->GetDatosPersonaparacuotasById($arrIdPersonas, $idestructura, $iddominio, $permiso);
    }
	public function ObtenerDatosPersona($idpersona){
	    return $this->persona->ObtenerDatosPersona($idpersona);
	}
   
}//Fin clase
?>