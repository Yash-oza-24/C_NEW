import React from 'react'

const Home = () => {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12" id="home">
      <div className="grid gap-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm shadow-slate-900/5">
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Product dashboard</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Your catalog is ready.</h1>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="h-40 rounded-3xl border border-dashed border-slate-200 bg-slate-50" />
              <div className="h-40 rounded-3xl border border-dashed border-slate-200 bg-slate-50" />
              <div className="h-40 rounded-3xl border border-dashed border-slate-200 bg-slate-50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
