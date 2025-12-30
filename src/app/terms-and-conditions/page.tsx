export default function TermsAndConditionsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-8 pt-32 bg-white text-black">
      <div className="max-w-5xl prose prose-lg">
        <h1 className="text-3xl font-bold mb-8">Términos y Condiciones</h1>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Última actualización:</strong> 3/10/2025
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar la aplicación ProKick (&quot;la App&quot;, &quot;nuestro servicio&quot;), 
            usted acepta estar sujeto a estos Términos y Condiciones
            Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Descripción del Servicio</h2>
          <p>
            ProKick es una plataforma digital que facilita la busqueda y organización de partidos casuales de fútbol, 
            incluyendo pero no limitado a:
          </p>
          <ul className="list-disc pl-6 mt-4">
            <li>Busqueda de sedes cercanas</li>
            <li>Creación y gestión de equipos y perfiles de jugadores</li>
            <li>Sistema de ranking y clasificación por género y ubicación</li>
            <li>Agendamiento de partidos en sedes verificadas</li>
            <li>Sistema de verificación de identidad mediante QR, GPS y selfies</li>
            <li>Registro de resultados y estadísticas de partidos</li>
            <li>Sistema de reputación y moderación de contenido</li>
            <li>Leaderboards nacionales, provinciales y por ciudad</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Registro y Cuenta de Usuario</h2>
          <h3 className="text-xl font-medium mb-3">3.1 Autenticación</h3>
          <p>
            Para utilizar nuestros servicios, debe registrarse utilizando exclusivamente su cuenta de Google. 
            No aceptamos registros con email y contraseña tradicionales.
          </p>
          
          <h3 className="text-xl font-medium mb-3 mt-6">3.2 Información Requerida</h3>
          <p>
            Para completar su perfil y participar en rankings, debe proporcionar:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Ubicación geográfica (provincia y ciudad)</li>
            <li>Género (para subdivisiones de ranking)</li>
            <li>Datos deportivos básicos (posición, pie hábil, etc.)</li>
          </ul>

          <h3 className="text-xl font-medium mb-3 mt-6">3.3 Responsabilidades del Usuario</h3>
          <p>
            Usted es responsable de:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Mantener la confidencialidad de su cuenta</li>
            <li>Proporcionar información veraz y actualizada</li>
            <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
            <li>Respetar las reglas de la comunidad y el fair play</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Sistema de Ranking y ELO</h2>
          <h3 className="text-xl font-medium mb-3">4.1 Cálculo de ELO</h3>
          <p>
            Nuestro sistema de ranking utiliza un algoritmo ELO adaptado para fútbol 5 que considera:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Resultado del partido (victoria, empate, derrota)</li>
            <li>Fuerza relativa de los equipos</li>
            <li>Rendimiento individual (goles, asistencias, minutos jugados)</li>
            <li>Fiabilidad del jugador (asistencia, verificación)</li>
            <li>Subdivisiones por género (masculino, femenino, mixto)</li>
          </ul>

          <h3 className="text-xl font-medium mb-3 mt-6">4.2 Límites y Restricciones</h3>
          <p>
            El sistema aplica las siguientes reglas:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>ELO inicial: 1000 puntos</li>
            <li>Límites de cambio por partido según tipo (amistoso: 35, liga: 50, playoff: 60)</li>
            <li>Decay por inactividad: -10 puntos cada 30 días sin jugar</li>
            <li>Período provisional: primeros 10 partidos con multiplicador 1.5x</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Verificación y Antifraude</h2>
          <h3 className="text-xl font-medium mb-3">5.1 Verificación de Identidad</h3>
          <p>
            Para participar en partidos oficiales, debe completar la verificación que incluye:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Escaneo de código QR del partido</li>
            <li>Verificación de ubicación GPS (tolerancia ±100m)</li>
            <li>Selfie con verificación de vida (liveness) cuando sea requerido</li>
          </ul>

          <h3 className="text-xl font-medium mb-3 mt-6">5.2 Medidas Antifraude</h3>
          <p>
            Implementamos sistemas para detectar y prevenir:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Partidos ficticios o &quot;fantasma&quot;</li>
            <li>Múltiples cuentas de un mismo usuario</li>
            <li>Manipulación de resultados</li>
            <li>Uso de dispositivos virtuales o emuladores</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Geolocalización y Privacidad</h2>
          <h3 className="text-xl font-medium mb-3">6.1 Uso de Ubicación</h3>
          <p>
            Recopilamos y utilizamos su ubicación geográfica para:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Verificar asistencia a partidos</li>
            <li>Mostrar sedes cercanas</li>
            <li>Generar rankings por ubicación</li>
            <li>Prevenir fraude en verificaciones</li>
          </ul>

          <h3 className="text-xl font-medium mb-3 mt-6">6.2 Datos Biométricos</h3>
          <p>
            Cuando sea requerido, procesamos selfies para verificación de identidad. 
            Estos datos se almacenan de forma segura y se utilizan únicamente para fines de verificación.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Equipos y Membresías</h2>
          <h3 className="text-xl font-medium mb-3">7.1 Límites de Equipos</h3>
          <p>
            Los usuarios tienen las siguientes limitaciones según su plan:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Plan Gratuito:</strong> 1 equipo activo, hasta 10 sedes</li>
            <li><strong>Plan Pro:</strong> hasta 5 equipos activos, sedes ilimitadas</li>
            <li><strong>Plan Organizer Pro:</strong> equipos ilimitados, sedes ilimitadas</li>
          </ul>

          <h3 className="text-xl font-medium mb-3 mt-6">7.2 Cambio de Equipos</h3>
          <p>
            Existe un período de cooldown de 7 días al abandonar un equipo antes de unirse a otro, 
            para prevenir la formación de &quot;superequipos&quot; instantáneos.
          </p>

          <h3 className="text-xl font-medium mb-3 mt-6">7.3 Competitividad y Ranking</h3>
          <p>
            <strong>Importante:</strong> Solo los equipos con al menos un miembro con suscripción Pro 
            pueden participar en ligas oficiales, torneos competitivos y afectar el ranking nacional. 
            Los equipos con todos los miembros en plan gratuito solo pueden participar en partidos amistosos 
            y no influyen en los leaderboards oficiales.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Sedes y Verificación</h2>
          <h3 className="text-xl font-medium mb-3">8.1 Aprobación de Sedes</h3>
          <p>
            Las sedes deben completar un proceso de verificación (KYC) que incluye:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Documentación legal (CUIT, razón social, DNI)</li>
            <li>Fotografías del establecimiento</li>
            <li>Verificación de contacto y ubicación</li>
            <li>Revisión manual por nuestro equipo</li>
          </ul>

          <h3 className="text-xl font-medium mb-3 mt-6">8.2 Partidos Públicos vs Privados</h3>
          <p>
            Solo las sedes aprobadas pueden crear partidos públicos que puntúan en el ranking nacional. 
            Los partidos en sedes no aprobadas son privados y no afectan el ELO.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Sistema de Reputación</h2>
          <h3 className="text-xl font-medium mb-3">9.1 Cálculo de Reputación</h3>
          <p>
            Su puntuación de reputación (0-100) se basa en:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Puntualidad en partidos</li>
            <li>Fair play y deportividad</li>
            <li>Asistencia a partidos agendados</li>
            <li>Comportamiento en la comunidad</li>
          </ul>

          <h3 className="text-xl font-medium mb-3 mt-6">9.2 Consecuencias de Baja Reputación</h3>
          <p>
            Una reputación baja puede resultar en:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Restricción para crear partidos públicos</li>
            <li>Limitación en comentarios y interacciones</li>
            <li>Suspensión temporal o permanente</li>
            <li>Exclusión de leaderboards</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Moderación y Disputas</h2>
          <h3 className="text-xl font-medium mb-3">10.1 Sistema de Reportes</h3>
          <p>
            Los usuarios pueden reportar:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Conducta inapropiada de jugadores</li>
            <li>Contenido ofensivo o spam</li>
            <li>Disputas sobre resultados de partidos</li>
            <li>Problemas con sedes o organizadores</li>
          </ul>

          <h3 className="text-xl font-medium mb-3 mt-6">10.2 Resolución de Disputas</h3>
          <p>
            Las disputas se resuelven mediante:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Revisión de evidencia proporcionada</li>
            <li>Análisis de patrones de comportamiento</li>
            <li>Intervención de moderadores cuando sea necesario</li>
            <li>Audit log de todas las decisiones</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Suscripciones y Pagos</h2>
          <h3 className="text-xl font-medium mb-3">11.1 Planes de Suscripción</h3>
          <p>
            Ofrecemos diferentes planes con características específicas. 
            Los precios y características pueden cambiar con previo aviso de 30 días.
          </p>

          <h3 className="text-xl font-medium mb-3 mt-6">11.2 Período de Gracia</h3>
          <p>
            En caso de fallo en el pago, ofrecemos un período de gracia de 7 días 
            antes de degradar su cuenta al plan gratuito.
          </p>

          <h3 className="text-xl font-medium mb-3 mt-6">11.3 Acceso a Competitividad y Ranking</h3>
          <p>
            <strong>Plan Gratuito:</strong> Los usuarios con plan gratuito tienen acceso limitado a:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Crear y participar en partidos amistosos</li>
            <li>Ver rankings básicos (solo top 50)</li>
            <li>Acceso limitado a estadísticas personales</li>
            <li>No pueden participar en ligas oficiales ni torneos competitivos</li>
          </ul>
          
          <p className="mt-4">
            <strong>Plan Pro y superiores:</strong> Incluyen acceso completo a:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Participación en ligas y torneos competitivos oficiales</li>
            <li>Rankings completos sin restricciones</li>
            <li>Estadísticas detalladas y análisis de rendimiento</li>
            <li>Acceso a leaderboards nacionales, provinciales y por ciudad</li>
            <li>Participación en eventos especiales y competencias</li>
            <li>Historial completo de partidos y progresión ELO</li>
            <li>Notificaciones de competencias y oportunidades de ranking</li>
          </ul>

          <h3 className="text-xl font-medium mb-3 mt-6">11.4 Cancelación</h3>
          <p>
            Puede cancelar su suscripción en cualquier momento. 
            El acceso a características premium continuará hasta el final del período pagado.
            <strong>Importante:</strong> Al degradar a plan gratuito, perderá acceso a competencias oficiales 
            y rankings completos, manteniendo solo las funcionalidades básicas.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Propiedad Intelectual</h2>
          <p>
            Todo el contenido de la aplicación, incluyendo pero no limitado a textos, 
            gráficos, logos, iconos, imágenes, clips de audio, compilaciones de datos, 
            y software, es propiedad de ProKick o sus licenciantes y está protegido por 
            las leyes de derechos de autor y marcas registradas.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Limitación de Responsabilidad</h2>
          <p>
            ProKick no será responsable por:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Lesiones físicas ocurridas durante partidos organizados a través de la plataforma</li>
            <li>Pérdida de datos o interrupciones del servicio</li>
            <li>Disputas entre usuarios o equipos</li>
            <li>Decisiones de moderación o cambios en el sistema de ranking</li>
            <li>Daños indirectos, incidentales o consecuenciales</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Terminación</h2>
          <p>
            Podemos suspender o terminar su cuenta inmediatamente si:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Viola estos términos y condiciones</li>
            <li>Participa en actividades fraudulentas</li>
            <li>Muestra comportamiento tóxico o inapropiado</li>
            <li>No cumple con las reglas de la comunidad</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. 
            Los cambios significativos serán notificados con al menos 30 días de anticipación. 
            El uso continuado del servicio constituye aceptación de los nuevos términos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">16. Ley Aplicable</h2>
          <p>
            Estos términos se rigen por las leyes de la República Argentina. 
            Cualquier disputa será resuelta en los tribunales competentes de la Ciudad de Buenos Aires.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">17. Contacto</h2>
          <p>
            Para consultas sobre estos términos y condiciones, puede contactarnos en:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Email: legal@prokick.com</li>
            <li>Dirección: [Dirección de la empresa]</li>
            <li>Teléfono: [Número de teléfono]</li>
          </ul>
        </section>

        <div className="bg-gray-50 p-6 rounded-lg mt-12">
          <h3 className="text-lg font-semibold mb-2">Aceptación</h3>
          <p className="text-sm text-gray-600">
            Al utilizar ProKick, usted confirma que ha leído, entendido y acepta estar sujeto a estos Términos y Condiciones.
          </p>
        </div>
      </div>
    </div>
  );
}