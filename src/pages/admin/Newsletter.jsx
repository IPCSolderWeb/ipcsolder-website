import { useState, useEffect } from 'react'

const Newsletter = () => {
    const [analytics, setAnalytics] = useState({
        totalSubscribers: 0,
        recentSubscribers: 0,
        confirmationRate: 0,
        languageBreakdown: { es: 0, en: 0 },
        monthlyGrowth: [],
        lastUpdated: null
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showSubscribers, setShowSubscribers] = useState(false)
    const [subscribers, setSubscribers] = useState([])
    const [subscribersLoading, setSubscribersLoading] = useState(false)

    // Cargar analytics del newsletter desde la API
    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch('/api/newsletter/analytics')

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`)
                }

                const contentType = response.headers.get('content-type')
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text()
                    console.error('API devolvió contenido no-JSON:', text.substring(0, 200))
                    throw new Error('La API no está ejecutándose correctamente. ¿Está Next.js corriendo?')
                }

                const data = await response.json()

                // Validar que la respuesta tenga la estructura esperada
                if (!data || typeof data.totalSubscribers === 'undefined') {
                    console.error('Respuesta de API inválida:', data)
                    throw new Error('La API devolvió datos en formato incorrecto')
                }

                setAnalytics(data)

            } catch (error) {
                console.error('Error loading newsletter analytics:', error)

                // Mensajes de error más específicos
                let errorMessage = error.message
                if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'No se puede conectar con la API. ¿Está el servidor corriendo?'
                } else if (error.message.includes('Unexpected token')) {
                    errorMessage = 'La API no está funcionando. Verifica que Next.js esté corriendo con "npm run dev"'
                }

                setError(errorMessage)
            } finally {
                setLoading(false)
            }
        }

        loadAnalytics()
    }, [])

    // Cargar lista de suscriptores
    const loadSubscribers = async () => {
        try {
            setSubscribersLoading(true)
            const response = await fetch('/api/newsletter/subscribers?status=active&limit=100')
            if (!response.ok) {
                throw new Error('Error al cargar suscriptores')
            }
            const data = await response.json()
            setSubscribers(data.subscribers)
        } catch (error) {
            console.error('Error loading subscribers:', error)
        } finally {
            setSubscribersLoading(false)
        }
    }

    // Exportar lista de suscriptores
    const exportSubscribers = async () => {
        try {
            const response = await fetch('/api/newsletter/subscribers?status=active&limit=1000')
            if (!response.ok) {
                throw new Error('Error al exportar suscriptores')
            }
            const data = await response.json()

            // Crear CSV
            const csvContent = [
                'Email,Idioma,Fecha Suscripción,Fecha Confirmación',
                ...data.subscribers.map(sub =>
                    `${sub.email},${sub.language},${new Date(sub.subscribedAt).toLocaleDateString('es-ES')},${sub.confirmedAt ? new Date(sub.confirmedAt).toLocaleDateString('es-ES') : 'N/A'}`
                )
            ].join('\n')

            // Descargar archivo
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
            link.click()
        } catch (error) {
            console.error('Error exporting subscribers:', error)
            alert('Error al exportar la lista de suscriptores')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando analytics...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar analytics</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Newsletter Analytics</h1>
                <p className="mt-2 text-gray-600">
                    Estadísticas y gestión de suscriptores del newsletter técnico
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Total Subscribers */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                <span className="text-white text-lg">👥</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Suscriptores</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.totalSubscribers}</p>
                        </div>
                    </div>
                </div>

                {/* New This Week */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                <span className="text-white text-lg">📈</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Últimos 30 días</p>
                            <p className="text-2xl font-bold text-gray-900">+{analytics.recentSubscribers}</p>
                        </div>
                    </div>
                </div>

                {/* Confirmation Rate */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                <span className="text-white text-lg">✅</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tasa Confirmación</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.confirmationRate}%</p>
                        </div>
                    </div>
                </div>

                {/* Last Updated */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                <span className="text-white text-lg">�</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Última Actualización</p>
                            <p className="text-sm font-bold text-gray-900">
                                {analytics.lastUpdated
                                    ? new Date(analytics.lastUpdated).toLocaleString('es-ES')
                                    : 'N/A'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Language Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Idioma</h3>
                <div className="space-y-4">
                    {Object.entries(analytics.languageBreakdown).map(([lang, count]) => (
                        <div key={lang}>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>
                                    {lang === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}
                                </span>
                                <span>{count} suscriptores</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${lang === 'es' ? 'bg-blue-500' : 'bg-green-500'}`}
                                    style={{
                                        width: analytics.totalSubscribers > 0
                                            ? `${(count / analytics.totalSubscribers) * 100}%`
                                            : '0%'
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Monthly Growth Chart */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Crecimiento Mensual</h3>
                <div className="space-y-3">
                    {analytics.monthlyGrowth.map((month, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                            <div className="flex items-center">
                                <span className="text-lg mr-3">📊</span>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 capitalize">
                                        {month.month}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{
                                            width: `${Math.max((month.subscribers / Math.max(...analytics.monthlyGrowth.map(m => m.subscribers), 1)) * 100, 5)}%`
                                        }}
                                    ></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                                    +{month.subscribers}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
                <button
                    onClick={() => {
                        setShowSubscribers(true)
                        loadSubscribers()
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Ver Todos los Suscriptores
                </button>
                <button
                    onClick={exportSubscribers}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                    Exportar Lista
                </button>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Enviar Newsletter Manual
                </button>
            </div>

            {/* Modal de Suscriptores */}
            {showSubscribers && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Lista de Suscriptores</h3>
                            <button
                                onClick={() => setShowSubscribers(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {subscribersLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-2 text-gray-600">Cargando suscriptores...</span>
                            </div>
                        ) : (
                            <div className="overflow-y-auto max-h-96">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                                            <th className="px-4 py-2 text-left font-medium text-gray-700">Idioma</th>
                                            <th className="px-4 py-2 text-left font-medium text-gray-700">Estado</th>
                                            <th className="px-4 py-2 text-left font-medium text-gray-700">Fecha Suscripción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subscribers.map((subscriber) => (
                                            <tr key={subscriber.id} className="border-b border-gray-100">
                                                <td className="px-4 py-2 text-gray-900">{subscriber.email}</td>
                                                <td className="px-4 py-2">
                                                    <span className="inline-flex items-center">
                                                        {subscriber.language === 'es' ? '🇪🇸' : '🇺🇸'}
                                                        <span className="ml-1 text-gray-700">
                                                            {subscriber.language === 'es' ? 'Español' : 'English'}
                                                        </span>
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${subscriber.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : subscriber.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {subscriber.status === 'active' ? 'Activo' :
                                                            subscriber.status === 'pending' ? 'Pendiente' : 'Desuscrito'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-gray-600">
                                                    {new Date(subscriber.subscribedAt).toLocaleDateString('es-ES')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {subscribers.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No hay suscriptores activos
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Newsletter