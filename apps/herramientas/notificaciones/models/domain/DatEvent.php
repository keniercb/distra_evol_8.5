<?php

class DatEvent extends BaseDatEvent
{

    const GENERIC_EVENT_NAME = "genericevent";

    public function setUp()
    {
        parent::setUp();
        $this->HasMany(
            'DatEventoAviso',
            array('local' => 'idevento', 'foreign' => 'idevento')
        );
    }

    public static function listarEventos($start, $limit)
    {
        $q = Doctrine_Query::create();
        $eventos = $q->select(
            'idevento, nombre, descripcion, referencia, activo'
        )
            ->from(__CLASS__)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->limit($limit)
            ->offset($start)
            ->orderBy('nombre')
            ->execute();

        return $eventos;
    }

    public static function getTotal()
    {
        return Doctrine_Query::create()
            ->select('count(idevento)')
            ->setHydrationMode(Doctrine :: HYDRATE_SINGLE_SCALAR)
            ->from(__CLASS__)->execute();
    }

    public static function isActive($event, $fieldName = 'nombre')
    {
        $event = Doctrine:: getTable(__CLASS__)->findBy($fieldName, $event);

        return $event[0]->activo;
    }

    public static function getId($event, $fieldName = 'nombre')
    {
        $event = Doctrine:: getTable(__CLASS__)->findBy($fieldName, $event);

        return $event[0]->idevento;
    }

    public function getIdByName($name)
    {
        $evento = $this->getByParam('nombre', $name);

        return $evento[0]['idevento'];
    }

    public static function getNotificationsInfoByEvent($nombre)
    {
        return Doctrine_Query:: create()
            ->select(
                'e.idevento as idevento,
                                         a.idaviso as id,
                                         a.cmpvalidador as component,
                                         a.svcvalidador as service'
            )
            ->from(__CLASS__ . ' as e')
            ->innerJoin('e.DatEventoAviso as ea')
            ->innerJoin('ea.DatAviso as a')
            ->where('e.nombre = ?', $nombre)
            ->setHydrationMode(Doctrine::HYDRATE_SCALAR)
            ->execute();
    }

    /**
     * getDefault
     * Devuelve el evento configurado por defecto para propósito general.
     *
     * @return int idaviso
     */
    public static function getDefault()
    {
        $id = self:: getId(self :: GENERIC_EVENT_NAME);
        if (!$id) {
            $event = new self();
            $event->nombre = self :: GENERIC_EVENT_NAME;
            $event->save();
            $id = $event->idevento;
        }

        return $id;
    }

    public function preDelete($event)
    {
        foreach ($this->DatEventoAviso as $eventoAviso) {
            $eventoAviso->DatAviso->delete();
        }
    }
}