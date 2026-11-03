<?php

class DatAvisoModel extends ZendExt_Model
{

    private $_telematicClient;

    public function setUp()
    {
        parent::ZendExt_Model();
        $this->_telematicClient = TelematicClientModel:: getInstance();
    }

    public function insertardat_aviso(DatAviso $datAviso)
    {
        $datAviso->save();
    }

    public function modificardat_aviso(DatAviso $datAviso)
    {
        $datAviso->save();
    }

    public function eliminardat_aviso(DatAviso $datAviso)
    {
        $datAviso->delete();
    }

    public function countListarAvisos($idevento)
    {
        return Doctrine_Query:: create()
            ->select('count(a.idaviso)')
            ->from('DatAviso a')
            ->innerJoin('a.DatEventoAviso ea')
            ->where('ea.idevento = ?', $idevento)
            ->setHydrationMode(Doctrine :: HYDRATE_SINGLE_SCALAR)
            ->execute();
    }

    public function listarAvisos($idevento, $start, $limit)
    {
        $result = array();
        $i = 0;
        if ($idevento) {
            $avisos = Doctrine:: getTable('DatEventoAviso')->createQuery('ea')
                ->innerJoin('ea.DatAviso a')
                ->innerJoin('a.NomTipoaviso ta')
                ->where('ea.idevento = ?', $idevento)
                ->offset($start)
                ->limit($limit)
                ->execute();
            foreach ($avisos as $aviso) {
                $result[$i]['idevento'] = $aviso->idevento;
                $result[$i]['idaviso'] = $aviso->idaviso;
                $result[$i]['activo'] = $aviso->DatAviso->activo;
                $result[$i]['denominacion'] = $aviso->DatAviso->denominacion;
                $result[$i]['descripcion'] = $aviso->DatAviso->descripcion;
                if ($aviso->DatAviso->cmpvalidador
                    && $aviso->DatAviso->svcvalidador
                ) {
                    $result[$i]['comando'] = implode(
                        ComponentSpecModel :: SEPARATOR,
                        array($aviso->DatAviso->cmpvalidador,
                              $aviso->DatAviso->svcvalidador)
                    );
                }
                $result[$i]['contenidos'] = DatAvisoDestinatarioViaContenido::getContentsByAviso(
                    $aviso->idaviso, false
                );
                $result[$i]['destinatarios']
                    = DatDestinatarioModel:: getByAviso($aviso->idaviso);
                $nomTipoAviso = $aviso->DatAviso->NomTipoaviso;
                $result[$i]['idtipo'] = $nomTipoAviso->idtipoaviso;
                $result[$i++]['tipo'] = $nomTipoAviso->denominacion;
            }
        }

        return $result;
    }

    public function listarAllAvisos()
    {
        $result = array();
        $i = 0;
        $avisos = Doctrine:: getTable('DatEventoAviso')->createQuery('ea')
            ->innerJoin('ea.DatAviso a')
            ->innerJoin('a.NomTipoaviso ta')
            ->execute();
        foreach ($avisos as $aviso) {
            $result[$i]['idevento'] = $aviso->idevento;
            $result[$i]['idaviso'] = $aviso->idaviso;
            $result[$i]['activo'] = $aviso->DatAviso->activo;
            $result[$i]['denominacion'] = $aviso->DatAviso->denominacion;
            $result[$i]['descripcion'] = $aviso->DatAviso->descripcion;
        }

        return result;
    }

    public function countAvisos()
    {
        return DatAviso::getTotal();
    }


    public static function getByCreator($idcreator)
    {
        return DatAviso:: getByCreator($idcreator);
    }

    public static function activarDesactivar($idaviso)
    {
        DatAviso::activarDesactivar($idaviso);
    }

    public static function isActive($idaviso)
    {
        return NotificacionesUtil::toStrictBoolean(
            Doctrine::getTable('DatAviso')->find($idaviso)->activo
        );
    }

    public static function getName($idaviso)
    {
        return Doctrine::getTable('DatAviso')->find($idaviso)->denominacion;
    }

    public function modificarContenidosAviso(
        $idaviso, $viasInfo, $destinatariosInfo
    )
    {
        $survivorsVias = array_values(
            array_diff($viasInfo->oldVias, $viasInfo->viasDesactivadas)
        );
        $survivorsDest = array_values(
            array_diff(
                $destinatariosInfo->oldDestinatarios,
                $destinatariosInfo->delDestinatarios
            )
        );
        $personModel = new DatPersonaNotificacionesModel();
        $idtipodest = $personModel->getTypeId();
        foreach ($survivorsDest as $survivor) {
            $destinatariosInfo->newDestinatarios[] = $survivor;
        }
        $contents = DatAvisoDestinatarioViaContenido:: getDistinctContents(
            $idaviso
        );
        if (count($destinatariosInfo->delDestinatarios)) {
            DatAvisoDestinatarioViaContenido:: deleteByDestAndAviso(
                $idaviso,
                DatPersonaNotificaciones:: getIdsDestinatariosByIdsPerson(
                    $destinatariosInfo->delDestinatarios
                )
            );
        }
        if (count($viasInfo->viasDesactivadas)) {
            foreach ($viasInfo->viasDesactivadas as $viaDesactivada) {
                foreach ($contents as $content) {
                    if ($contenido = Doctrine:: getTable(
                        'Dat' . ucfirst($viaDesactivada) . 'Content'
                    )->find(
                        $content['idcontenido']
                    )
                    ) {
                        $contenido->DatContenido->delete();
                        break;
                    }
                }
            }
        }
        $avisoObj = Doctrine::getTable('DatAviso')->find($idaviso);
        $i = count($avisoObj->DatAvisoDestinatarioViaContenido);
        if (count($viasInfo->viasActivadas)) {
            foreach ($viasInfo->viasActivadas as $viaActivada) {
                $concretContentClass
                    = 'Dat' . ucfirst($viaActivada) . 'Content';
                $concretContentObj = new $concretContentClass();
                $concretContentModelClass = $concretContentClass . 'Model';
                $concretContentModelMethod
                    = 'insertardat_' . $viaActivada . '_content';
                $concretContentModelObj = new $concretContentModelClass();
                $concretContentObj->texto = $viasInfo->data->$viaActivada->body;
                if ($viasInfo->data->$viaActivada->topic) {
                    $concretContentObj->asunto
                        = $viasInfo->data->$viaActivada->topic;
                }
                $concretContentModelObj->$concretContentModelMethod(
                    $concretContentObj
                );
                //dest
                foreach ($destinatariosInfo->newDestinatarios as $destinatario) {
                    $iddestinatario = DatDestinatarioModel::insertarDestinatario($idtipodest, $destinatario);
                    $avisoObj->DatAvisoDestinatarioViaContenido[$i]->iddestinatario = $iddestinatario;
                    $avisoObj->DatAvisoDestinatarioViaContenido[$i++]->idcontenido = $concretContentObj->idcontenido;
                }
            }
        }
        if (count($survivorsVias)) {
            foreach ($survivorsVias as $via) {
                foreach ($contents as $content) {
                    if (
                    $contenido = Doctrine::getTable(
                        'Dat' . ucfirst($via) . 'Content'
                    )->find($content['idcontenido'])
                    ) {
                        $contenido->texto = $viasInfo->data->$via->body;
                        if ($viasInfo->data->$via->topic) {
                            $contenido->asunto = $viasInfo->data->$via->topic;
                        }
                        $contenido->save();
                        //dest                        
                        foreach ($destinatariosInfo->newDestinatarios as $destinatario) {
                            $iddestinatario = DatDestinatarioModel::insertarDestinatario($idtipodest, $destinatario);
                            if (!DatAvisoDestinatarioViaContenido::existee(
                                $idaviso, $contenido->idcontenido, $iddestinatario
                            )
                            ) {
                                $avisoObj->DatAvisoDestinatarioViaContenido[$i]->idcontenido = $contenido->idcontenido;
                                $avisoObj->DatAvisoDestinatarioViaContenido[$i++]->iddestinatario = $iddestinatario;
                            }
                        }
                    }
                }
            }
        }
        $avisoObj->save();
    }

    private function generateUuid()
    {
        return (string)Zend_Uuid:: generate();
    }

    public function enviarJabber($jabberInfo, $obj)
    {
        $jabberInfo['mensaje'] = array($jabberInfo['mensaje']);
        $jabberInfo['id'] = $this->generateUuid();
        $jabberInfo['viaenvio'] = Doctrine:: getTable('NomTipoContenido')
            ->findOneByDenominacion('jabber')->viaenvio;
        $this->_telematicClient->enviarMensajeListaContactos($jabberInfo, $obj);
    }

    public function enviarEmail($emailInfo, $obj)
    {
        $emailInfo['id'] = $this->generateUuid();
        $emailInfo['viaenvio'] = Doctrine:: getTable('NomTipoContenido')
            ->findOneByDenominacion('email')->viaenvio;
        $this->_telematicClient->enviarCorreoSinAdjunto($emailInfo, $obj);
    }

    /**
     * setMensajeJabber
     */
    public static function setMensajeJabber($idaviso, $mensaje)
    {
        return Doctrine_Manager:: getInstance()
            ->getCurrentConnection()
            ->fetchAll(
                "UPDATE mod_notificaciones.dat_jabbercontent
             SET texto = $mensaje
             WHERE idcontenido = (SELECT c.idcontenido
             FROM mod_notificaciones.dat_aviso v
             inner join mod_notificaciones.dat_avisodestinatarioviacontenido d
             ON (d.idaviso = v.idaviso)
             inner join mod_notificaciones.dat_contenido c
             ON (d.idcontenido = c.idcontenido)
             inner join mod_notificaciones.dat_jabbercontent j
             ON (j.idcontenido = c.idcontenido)
             WHERE v.idaviso = $idaviso GROUP BY c.idcontenido)"
            );
    }

    public static function getIdAvisoByDenominacion($denominacion)
    {
        return Doctrine_Manager:: getInstance()
            ->getCurrentConnection()
            ->fetchAll(
                "SELECT a.idaviso
            FROM mod_notificaciones.dat_aviso a
            inner join mod_notificaciones.dat_eventoaviso d
            ON (a.idaviso = d.idaviso)
            inner join mod_notificaciones.dat_evento e
            ON (e.idevento = d.idevento)
            WHERE e.nombre = $denominacion"
            );
    }

    public static function getIdAvisoDadoDenominacion($idevento, $denominacion)
    {
        return DatEventoAviso::getIdAvisoByDenominacion(
            $idevento, $denominacion
        );
    }
}
